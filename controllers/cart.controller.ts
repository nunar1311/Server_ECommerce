import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import cartModel from "../models/cart.model";
import userModel from "../models/user.model";
import productModel from "../models/product.model";

export const addToCart = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.user?._id;

            let cart = await cartModel.findOne({ userId });
            if (!cart) {
                cart = new cartModel({ userId });
            }

            const existingItem = cart?.products.find(
                (item: any) => item.product._id.toString() === id,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const product: any = await productModel
                    .findById(id)
                    .select(
                        "-description -richDescription -images -initP -isFeatured -isFlashSale",
                    );
                cart.products.push({ product, quantity });
            }

            await cart.save();

            res.status(201).json({
                success: true,
                cart,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);

export const getCart = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = await userModel.findById(id);
            const cart = await cartModel.findOne({ userId });
            res.status(200).json({
                success: true,
                cart,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 400));
        }
    },
);

export const deleteCart = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = req.user?._id;

            let cart = await cartModel.findOne({ userId });
            if (!cart) {
                return;
            }

            const existingItem = cart?.products.findIndex(
                (item: any) => item.product._id.toString() === id,
            );

            if (existingItem === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found in cart",
                });
            }

            cart.products.splice(existingItem, 1);

            await cart.save();

            res.status(200).json({
                success: true,
                message: "Product deleted from cart",
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    },
);
