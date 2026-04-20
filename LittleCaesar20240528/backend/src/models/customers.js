/*
campos
   name
   lastName
   birthDate
    email
    password
    isVerified
    loginAtempts
    timeOut
 */

    import { Schema, model } from "mongoose";

    const customerSchema = new Schema({
        name: {type: String},
        lastName: {type: String},
        birthDate: {type: Date},
        email: {type: String},
        password: {type: String},
        isVerified: {type: Boolean},
        loginAttempts: {type: Number},
        timeOut: {type: Date}
    }, {
        timestamps: true,
        strict: false
    });

    export default model("Customer", customerSchema);