const mongoose = require("mongoose");

const cardScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 30,
            required: true
        },
        link: {
            type: String,
            validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        likes: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
            ],
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("card", cardScheme);
