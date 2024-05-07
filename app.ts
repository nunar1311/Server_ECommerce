import express, { NextFunction, Request, Response } from "express";
export const app = express();

import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.router";

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.ORIGIN,
    }),
);

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", cartRouter);

app.get(
    "/test",
    (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            success: true,
            message: "API is working",
        });
    },
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(
        `Route ${req.originalUrl} not found`,
    ) as any;
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);
