const userRouter = require("express").Router();
const mongoose = require('mongoose');
const  auth  = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser } = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/:userId", auth,
celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validateObjectId),
  }),
}),
getUserById);
//userRouter.post("/", createUser);
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

//userRouter.post('/signin', login);
//userRouter.post('/signup', createUser);
userRouter.get('/me', getCurrentUser);

function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);

  if (isValid) return value;

  console.log('ID is not valid');
}


module.exports = userRouter;

