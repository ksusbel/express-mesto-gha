const userRouter = require("express").Router();
const { auth } = require('../middlewares/auth');
const { getUsers, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser } = require("../controllers/users");

userRouter.get("/", auth, getUsers);
userRouter.get("/:userId", auth, getUserById);
//userRouter.post("/", createUser);
userRouter.patch("/me", auth, updateUser);
userRouter.patch("/me/avatar", auth, updateAvatar);
userRouter.post('/signin', login);
userRouter.post('/signup', createUser);
userRouter.get('/me', auth, getCurrentUser);

module.exports = userRouter;
