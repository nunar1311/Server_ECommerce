import mongoose, { Document, Model } from "mongoose";

interface IComment extends Document {
    user: object;
    comment: string;
    commentReplies: IComment[];
}
interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayed: string;
    link: ILink[];
    suggestion: string;
    question: IComment[];
}

interface ICourse extends Document {
    name: string;
    description?: string;
    price: number;
    estimatePrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}

const reviewSchema = new mongoose.Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});

const linkSchema = new mongoose.Schema<ILink>({
    title: String,
    url: String,
});

const commentSchema = new mongoose.Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [Object],
});

const courseDataSchema = new mongoose.Schema<ICourseData>({
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

const courseSchema = new mongoose.Schema<ICourse>({
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

const courseModel: Model<ICourse> = mongoose.model(
    "Course",
    courseSchema,
);

export default courseModel;
