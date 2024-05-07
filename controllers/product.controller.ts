import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { url } from "inspector";
import { createProduct } from "../services/product.service";
import productModel from "../models/product.model";
import { redis } from "../utils/redis";
import { name } from "ejs";

export const uploadProduct = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const image = data.image;
            const images = data.images;

            if (image) {
                const myCloud = await cloudinary.v2.uploader.upload(
                    image,
                    {
                        folder: "product",
                    },
                );
                data.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            if (images) {
                let uploadedImages = [];
                for (const imageObject of images) {
                    if (imageObject && imageObject.image) {
                        const myCloud =
                            await cloudinary.v2.uploader.upload(
                                imageObject.image,
                                {
                                    folder: "productItem",
                                },
                            );
                        uploadedImages.push({
                            image: {
                                public_id: myCloud.public_id,
                                url: myCloud.secure_url,
                            },
                        });
                    } else {
                        next(new ErrorHandler(imageObject, 400));
                    }
                }
                data.images = uploadedImages;
            }

            createProduct(data, res, next);
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);

export const getProduct = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await productModel
                .find()
                .select("-description -images -richDescription");

            res.status(200).json({
                success: true,
                product,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);

export const getSingleProduct = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.id;

        const isCacheExist = await redis.get(productId);
        if (isCacheExist) {
            const product = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                product,
            });
        } else {
            const product = await productModel.findById(
                req.params.id,
            );

            await redis.set(productId, JSON.stringify(product));

            res.status(200).json({
                success: true,
                product,
            });
        }

        try {
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);

export const searchProduct = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchQuery = req.query.query as string;

            const searchResults = await productModel.find({
                name: { $regex: new RegExp(searchQuery, "i") },
                $text: { $search: searchQuery },
            });

            res.status(200).json({
                success: true,
                searchResults,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);
