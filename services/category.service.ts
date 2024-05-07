import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import categoryModel from "../models/category.model";

export const createCategory = CatchAsyncErrors(
    async (data: any, res: Response) => {
        const category = await categoryModel.create(data);
        res.status(201).json({
            success: true,
            category,
        });
    },
);
