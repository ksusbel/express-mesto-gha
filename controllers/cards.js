const Card = require("../models/card");

const ERROR_CODE_DUPLICATE_MONGO = 11000;

module.exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find({});
        return res.send(cards);
    } catch (error) {
        return res.status(500).send({ message: "Ошибка на стороне сервера" });
    }
};

module.exports.createCard = async (req, res) => {
    try {
        const { name, link } = req.body;
        console.log(req.user._id); // _id станет доступен
        const ownerId = req.user._id;
        const newCard = await Card.create({ name, link, owner: ownerId });
        res.status(201).send(newCard);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({ message: "Невалидные данные" });
        }
        console.log(error.code);
    }
};

module.exports.deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(400).send({ message: "Карточка не найдена" });
        }
        await Card.findOneAndDelete(cardId);
        return res.send({ message: "Карточка удалилась" });
    } catch (err) {
      return res.status(400).send({ message: "Карточка не найдена" });
    }
};

module.exports.likeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(400).send({ message: "Карточка не найдена" });
        }
        await Card.findByIdAndUpdate(
            req.params.cardId,
            { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
            { new: true }
        );
        return res.send({ message: "Лайк поставился" });
    } catch (err) {
      return res.status(400).send({ message: "Карточка не найдена" });
    }
};

module.exports.dislikeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(400).send({ message: "Карточка не найдена" });
        }
        await Card.findByIdAndUpdate(
            req.params.cardId,
            { $pull: { likes: req.user._id } }, // убрать _id из массива
            { new: true }
        );
        return res.send({ message: "Лайк убрался" });
    } catch (err) {
      return res.status(400).send({ message: "Карточка не найдена" });
    }
};
