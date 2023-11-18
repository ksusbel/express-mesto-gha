const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [2, "Минимальная длинна 2 символа"],
            maxlength: [30, "Максимальная длинна 30 символа"],
            default: "Жак-Ив Кусто",
            required: true
        },
        about: {
            type: String,
            minlength: [2, "Минимальная длинна 2 символа"],
            maxlength: [30, "Максимальная длинна 30 символа"],
            default: "Исследователь",
            required: true
        },
        avatar: {
            type: String,
            default: "",
            pattern: {
                params: /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i,
                message: "Должен начинаться с http, https, проверьте правильность формата",
            },
            required: true
        },
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userScheme);
