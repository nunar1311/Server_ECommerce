import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    richDescription: string;
    image: {
        public_id: string;
        url: string;
    };
    images: {
        image: {
            public_id: string;
            url: string;
        };
    }[];
    price: number;
    initP: string;
    category: mongoose.Schema.Types.ObjectId | string;
    countInStock?: number;
    isFeatured: boolean;
    isFlashSale: boolean;
}

const productSchema: Schema<IProduct> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a product name."],
    },
    description: {
        type: String,
        required: [true, "Please enter description."],
    },
    richDescription: {
        type: String,
        default: "",
    },
    image: {
        public_id: String,
        url: String,
    },
    images: [
        {
            image: {
                public_id: String,
                url: String,
            },
        },
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    initP: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        min: 0,
        max: 255,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isFlashSale: {
        type: Boolean,
        default: false,
    },
});

const productModel: Model<IProduct> = mongoose.model(
    "Product",
    productSchema,
);

export default productModel;
