const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            lowercase: true,
            maxlength: 255,
            trim: true,
            unique: [true, "Username is already taken, please choose another"],
        },
        firstname: { type: String, required: [true, "First Name is required"], maxlength: 255 },
        lastname: { type: String, required: [true, "Last Name is required"], maxlength: 255 },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password should not be less than 8 characters"],
            maxlength: [64, "Password should not be more than 64 characters"],
        },
    },
    { timeseries: true }
);

const User = new mongoose.model("User", UserSchema);
module.exports = User;
