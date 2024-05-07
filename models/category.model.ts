import mongoose, { Document, Schema, Model } from "mongoose";

interface ICategory extends Document {
    name: string;
    icon?: string;
    image?: {
        public_id: string;
        url: string;
    };
}

const categorySchema: Schema<ICategory> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a category name."],
    },
    icon: {
        type: String,
    },
    image: {
        public_id: String,
        url: String,
    },
});

const categoryModel: Model<ICategory> = mongoose.model(
    "Category",
    categorySchema,
);

export default categoryModel;
