const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ValidationError = require('../errors/ValidationError');
//const AlreadyExistsError = require('../errors/AlreadyExistsError');

const ERROR_CODE_DUPLICATE_MONGO = 11000;

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).send(users);
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

module.exports.createUser = (req, res, next) => {
  const {email, password, name, about, avatar, } = req.body;
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash // записываем хеш в базу
}))
.then((user) => res.status(201).send({
  _id: user._id,
  email: user.email,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
}))
.catch((err) => {
   if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
    //next(new AlreadyExistsError('Пользователь с таким email уже существует'));
  } else
    if (err.code === 400) {

    next(new ValidationError('Переданы некорректные данные при создании пользователя'));
  } else  {
    next(err);
  }
})
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

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select("+password")
      .orFail((err) => new Error("NotAutanticate"));

    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new Error("NotAutanticate");
    }

    const token = generateToken({ _id: user._id, email: user.email });
    res.cookie("parrotToken", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 360000,
    });
    res.send({ email: user.email });
  } catch (error) {
    if (error.message === "NotAutanticate") {
      return res
        .status(401)
        .send({ message: "Не правильные email или password" });
    }

    return res.status(500).send(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    console.log("user");
     const user = await User.findById(req.user._id)
     console.log(user);
  if (!user) {
    return res.status(404).send({ message: "Пользователь не найден" });
  }
 res.status(200).send(user);
} catch (err) {
  return res.status(500).send({ message: "На сервере произошла ошибка" });
}
};
