import mongoose, { Document, Schema, Model } from "mongoose";

interface ICart extends Document {
    userId: mongoose.Schema.Types.ObjectId | string;
    products: {
        product: object;
        quantity: number;
    }[];
}

const cartSchema: Schema<ICart> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    products: [
        {
            product: {
                type: Object,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
});

const cartModel: Model<ICart> = mongoose.model("Cart", cartSchema);

export default cartModel;
