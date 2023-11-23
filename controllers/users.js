const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const ERROR_CODE_DUPLICATE_MONGO = 11000;

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users);
    } catch (error) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        if (error.name === "CastError") {
            return res.status(400).send({ message: "Передан не валидный id" });
        }
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.createUser = (req, res) => {
  //const {email, password, name, about, avatar, } = req.body;
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
};

module.exports.updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, about } = req.body;
        const user = await User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        res.send(user);
        //  return res.send({ message: "Пользователь обновился" });
    } catch (err) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.updateAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const { avatar } = req.body;
        const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        res.send(user);
        // return res.send({ message: "Аватар обновился" });
    } catch (err) {
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email })
  .select('+password')
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user.payload)
    .then((user) => res.send(user))
    .catch(next);
};
