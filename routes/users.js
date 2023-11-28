const userRouter = require("express").Router();
const mongoose = require('mongoose');
const  auth  = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUserById, updateUser, updateAvatar, getCurrentUser } = require("../controllers/users");

userRouter.get("/", getUsers);

userRouter.get('/me', auth, getCurrentUser);

 userRouter.get("/:userId", auth,
celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validateObjectId),
  }),
}),
getUserById);

userRouter.patch("/me", auth,
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}),
updateUser);

userRouter.patch("/me/avatar", auth,
celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i),
  }),
}),
updateAvatar);



function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);

  if (isValid) return value;

  console.log('ID is not valid');
}


module.exports = userRouter;

