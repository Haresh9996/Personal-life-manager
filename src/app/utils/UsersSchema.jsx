const { default: mongoose } = require("mongoose");

const userModel = new mongoose.Schema({
    firstName: {  type: String, required: true, },
    lastName: { type: String, required: true, },
    password: { type: String, required: true, },
    email: { type: String, required: true, unique: true, },
    dob: { type: Date, required: true, },
    gender: { type: String, required: true, },
    occupation: { type: String, required: true, }
});

export const userSchema = mongoose.models.users || mongoose.model("users", userModel)