const express = require("express");
const mongoose = require("mongoose");
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { celebrate, Joi } = require('celebrate');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const DATABASE_URL = "mongodb://127.0.0.1:27017/mestodb";

const app = express();

mongoose
    .connect(DATABASE_URL)
    .then(() => {
        console.log(`Connected to database on ${DATABASE_URL}`);
    })
    .catch((err) => {
        console.log("Error on database connection");
        console.error(err);
    });

app.use(express.json());

app.post('/signup',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}),
createUser);

app.post('/signin',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}),
login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  return res.status(404).send({ message: "Такой страницы не существует" });
});

app.get("/", (req, res) => {
    res.status(200).send({ message: "Привет" });
});

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
});
