import { NextFunction, Response, Request } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { url } from "inspector";
import { createCategory } from "../services/category.service";
import categoryModel from "../models/category.model";
import { redis } from "../utils/redis";

export const uploadCategory = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const image = data.image;
            if (image) {
                const myCloud = await cloudinary.v2.uploader.upload(
                    image,
                    {
                        folder: "Category",
                    },
                );
                data.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.url,
                };
            }
            createCategory(data, res, next);
        } catch (error: any) {
            next(new ErrorHandler(error.message, 400));
        }
    },
);

export const getCategory = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = await categoryModel.find();

            res.status(200).json({
                success: true,
                category,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 400));
        }
    },
);

export const updateCategory = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const image = data.image;

            if (image) {
                await cloudinary.v2.uploader.destroy(image.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(
                    image,
                    {
                        folder: "Category",
                    },
                );

                data.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            const categoryId = req.params.id;

            const category = await categoryModel.findByIdAndUpdate(
                categoryId,
                {
                    $set: data,
                },
                { new: true },
            );

            res.status(201).json({
                success: true,
                category,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);

export const deleteCategory = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const category = await categoryModel.findById(id);
            if (!category) {
                next(new ErrorHandler("The category not found", 404));
            }

            await category?.deleteOne({ id });
            await redis.del(id);
            res.status(200).json({
                success: true,
                message: "The category is deleted",
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);
