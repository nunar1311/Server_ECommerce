import { app } from "./app";
import http from "http";
import "dotenv/config";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

const server = http.createServer(app);
const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server is connected with port ${port}`);
    connectDB();
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
