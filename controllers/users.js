const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      //  return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      // return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.status(200).send(user);
  } catch (err) {
    //   console.log(err);
    if (err.name === 'CastError') {
      return next(new ValidationError('Передан не валидный id'));
    }
    next(err);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    name,
    about,
    avatar,
  } = req.body;
  // хешируем пароль
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
      //  res.status(409).send({ message: 'Пользователь с таким email уже существует' });
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
module.exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      //  return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(user);
    //  return res.send({ message: 'Пользователь обновился' });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      //  return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(user);
    // return res.send({ message: 'Аватар обновился' });
  } catch (err) {
    next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль1');
          }
          // создадим токен
          const token = jwt.sign({ _id: user._id }, 'some-secret-key');
          // вернём токен
          res.send({ token });
        });
    })
    .catch((err) => {
      next(err);
    });
};
