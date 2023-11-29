const mongoose = require('mongoose');
const validator = require('validator');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Имя не должно быть короче 2 символов'],
      maxlength: [30, 'Имя не должно быть длиннее 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Имя не должно быть короче 2 символов'],
      maxlength: [30, 'Имя не должно быть длиннее 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      pattern: /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Указана неверная почта.',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userScheme);
