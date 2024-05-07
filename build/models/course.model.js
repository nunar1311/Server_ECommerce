"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});
const linkSchema = new mongoose_1.default.Schema({
    title: String,
    url: String,
});
const commentSchema = new mongoose_1.default.Schema({
    user: Object,
    comment: String,
    commentReplies: [Object],
});
const courseDataSchema = new mongoose_1.default.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayed: String,
    link: [linkSchema],
    suggestion: String,
    question: [commentSchema],
});
const courseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatePrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
});
const courseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = courseModel;
