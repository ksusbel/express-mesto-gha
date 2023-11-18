const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
    req.user = {
        _id: "65572f552edf5e0725ea693b",
    };

    next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  return res.status(400).send({ message: "'Такой страницы не существует" });
});

app.get("/", (req, res) => {
    res.status(200).send({ message: "Привет" });
});

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
});
