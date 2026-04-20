/*
Campos
    name
    lastName
    DUI
    email
    password
    isVerified
    status
    idBranch
    */
import mongoose, {Schema, model} from "mongoose";

const employeeSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    DUI: {type: String},
    birthDate: {type: Date},
    email: {type: String},
    password: {type: String},
    isVerified: {type: Boolean},
    status: {type: String},
    idBranch: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "Branches"
    }
},{
    timestamps: true,
    strict: false
})

export default model("Employees", employeeSchema)
