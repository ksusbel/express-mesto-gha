const User = require("../models/user");

const ERROR_CODE_DUPLICATE_MONGO = 11000;

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users);
    } catch (error) {
        return res.status(500).send({ message: "Ошибка на стороне сервера" });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        if (error.name === "CastError") {
            return res.status(400).send({ message: "Передан не валидный id" });
        }
        return res.status(500).send({ message: "Ошибка на стороне сервера" });
    }
};

module.exports.createUser = async (req, res) => {
    try {
        const { name, about, avatar } = req.body;
        const newUser = await User.create({ name, about, avatar });
        res.status(201).send(newUser);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ message: "Ошибка валидации полей", ...err });
        }
        return res.status(500).send({ message: "Ошибка на стороне сервера" });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, about } = req.body;
        const user = await User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }

        return res.send({ message: "Пользователь обновился" });
    } catch (err) {
      return res.status(500).send({ message: "Ошибка на стороне сервера" });
    }
};

module.exports.updateAvatar = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { avatar } = req.body;
        const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }

        return res.send({ message: "Аватар обновился" });
    } catch (err) {
        next(err);
    }
};
