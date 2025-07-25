import "dotenv/config";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
    accessTokenOptions,
    refreshTokenOptions,
    sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, avatar } = req.body;

            const isEmailExist = await userModel.findOne({
                email,
            });
            if (isEmailExist) {
                return next(
                    new ErrorHandler("Email already exist", 400),
                );
            }

            const user: IRegistrationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;
            const data = {
                user: { name: user.name },
                activationCode,
            };
            const html = await ejs.renderFile(
                path.join(__dirname, "../mails/activation-mail.ejs"),
                data,
            );

            try {
                await sendMail({
                    email: user.email,
                    subject: `${activationCode}`,
                    template: "activation-mail.ejs",
                    data,
                });

                res.status(201).json({
                    success: true,
                    message: `${user.email}`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    },
);

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (
    user: any,
): IActivationToken => {
    const activationCode = Math.floor(
        1000 + Math.random() * 9000,
    ).toString();

    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: "5m" },
    );

    return { token, activationCode };
};

interface IActivationRequest {
    activation_code: string;
    activation_token: string;
}

export const activateUser = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_code, activation_token } =
                req.body as IActivationRequest;

            const newUser: {
                user: IUser;
                activationCode: string;
            } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string,
            ) as { user: IUser; activationCode: string };

            if (newUser.activationCode !== activation_code) {
                return next(
                    new ErrorHandler("Invalid activation code", 400),
                );
            }

            const { name, email, password } = newUser.user;

            const existUser = await userModel.findOne({
                email,
            });
            if (existUser) {
                return next(
                    new ErrorHandler("Email already exist", 400),
                );
            }

            const user = await userModel.create({
                name,
                email,
                password,
            });

            res.status(201).json({
                success: true,
                message: "Register successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    },
);

interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginRequest;

            if (!email || !password) {
                return next(
                    new ErrorHandler(
                        "Please enter your email and password",
                        400,
                    ),
                );
            }

            const user = await userModel
                .findOne({ email })
                .select("+password");

            if (!user) {
                return next(
                    new ErrorHandler(
                        "Invalid email and password",
                        400,
                    ),
                );
            }

            const comparePassword = await user.comparePassword(
                password,
            );
            if (!comparePassword) {
                return next(
                    new ErrorHandler(
                        "Invalid email and password",
                        400,
                    ),
                );
            }

            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    },
);

export const logoutUser = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });

            const userId = req.user?._id || "";
            redis.del(userId);

            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    },
);

export const updateAccessToken = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.cookies.refresh_token as string;
            const decoded = jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN || "",
            ) as JwtPayload;

            const message = "Could not refresh token";

            if (!decoded) {
                return next(new ErrorHandler(message, 400));
            }

            const session = await redis.get(decoded.id as string);
            if (!session) {
                return next(new ErrorHandler(message, 400));
            }

            const user = JSON.parse(session);

            const accessToken = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN as string,
                { expiresIn: "5m" },
            );

            const refreshToken = jwt.sign(
                { id: user._id },
                process.env.REFRESH_TOKEN as string,
                { expiresIn: "3d" },
            );

            req.user = user;

            res.cookie(
                "access_token",
                accessToken,
                accessTokenOptions,
            );
            res.cookie(
                "refresh_token",
                refreshToken,
                refreshTokenOptions,
            );

            next();
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    },
);

//Get user info
export const getUserInfo = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;
            getUserById(userId, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    },
);

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}

//Social Auth
export const socialAuth = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, avatar } =
                req.body as ISocialAuthBody;

            const user = await userModel.findOne({ email });
            if (!user) {
                const newUser = await userModel.create({
                    email,
                    name,
                    avatar,
                });
                sendToken(newUser, 200, res);
            } else {
                sendToken(user, 200, res);
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    },
);

interface IUpdateUserInfo {
    name: string;
    email: string;
}

//Update user info
export const updateUserInfo = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name } = req.body as IUpdateUserInfo;
            const userId = req.user?._id;

            const user = await userModel.findById(userId);
            if (user && email) {
                const isEmailExist = await userModel.findOne({
                    email,
                });
                if (isEmailExist) {
                    return next(
                        new ErrorHandler("Email already exist", 400),
                    );
                }

                user.email = email;
            }

            if (name && user) {
                user.name = name;
            }

            await user?.save();
            await redis.set(userId, JSON.stringify(user));

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    },
);

//Update password user
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } =
                req.body as IUpdatePassword;
            if (!oldPassword || !newPassword) {
                return next(
                    new ErrorHandler(
                        "Please enter new and old password",
                        400,
                    ),
                );
            }
            const user = await userModel
                .findById(req.user?._id)
                .select("+password");
            if (user?.password == undefined) {
                return next(new ErrorHandler("Invalid user", 400));
            }
            const isPasswordMatch = await user?.comparePassword(
                oldPassword,
            );
            if (!isPasswordMatch) {
                return next(
                    new ErrorHandler("Invalid old password", 400),
                );
            }

            user.password = newPassword;

            await user.save();

            await redis.set(req.user?._id, JSON.stringify(user));
            res.status(201).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    },
);

interface IUpdateProfilePicture {
    avatar: string;
}

//Update Profile Picture
export const updateProfilePicture = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body;
            const userId = req.user?._id;
            const user = await userModel.findById(userId);

            if (avatar && user) {
                //If user have one avatar then call this if
                if (user?.avatar?.public_id) {
                    await cloudinary.v2.uploader.destroy(
                        user?.avatar?.public_id,
                    );

                    const myCloud =
                        await cloudinary.v2.uploader.upload(avatar, {
                            folder: "avatars",
                            width: 150,
                        });
                    user.avatar = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    };
                } else {
                    const myCloud =
                        await cloudinary.v2.uploader.upload(avatar, {
                            folder: "avatars",
                            width: 150,
                        });
                    user.avatar = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    };
                }
            }

            await user?.save();
            await redis.set(userId, JSON.stringify(user));
            res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    },
);

export const deleteUser = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await userModel.findById(id);
            if (!user) {
                next(new ErrorHandler("User not found", 404));
            }

            await user?.deleteOne({ id });
            await redis.del(id);

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);
