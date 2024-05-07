import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import productModel from "../models/product.model";

export const createProduct = CatchAsyncErrors(
    async (data: any, res: Response) => {
        const product = await productModel.create(data);
        res.status(201).json({
            success: true,
            product,
        });
    },
);
