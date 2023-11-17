const mongoose = require("mongoose");

const cardScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [2, "Минимальная длинна 2 символа"],
            maxlength: [30, "Максимальная длинна 30 символа"],
            required: {
                value: true,
                message: "Поле является обязательным",
            },
        },
        link: {
            type: String,
            validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
            required: {
                value: true,
                message: "Поле является обязательным",
            },
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: {
                value: true,
                message: "Поле является обязательным",
            },
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
