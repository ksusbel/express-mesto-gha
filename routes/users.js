const userRouter = require("express").Router();
//const User = require('../models/user');
const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/me", updateUser);
userRouter.patch("/me/avatar", updateAvatar);

module.exports = userRouter;
