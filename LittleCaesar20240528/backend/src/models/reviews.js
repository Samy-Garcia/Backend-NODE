import mongoose, {Schema, model} from "mongoose";

const reviewSchema = new Schema({
    idEmployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employees",
        required: true
    },
    idPizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pizzas",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Review", reviewSchema);