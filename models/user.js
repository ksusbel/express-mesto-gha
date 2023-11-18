const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 30,
            required: true
        },
        about: {
            type: String,
            minlength: 2,
            maxlength: 30,
            required: true
        },
        avatar: {
            type: String,
            default: "",
            pattern: /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i,
            required: true
        },
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userScheme);
