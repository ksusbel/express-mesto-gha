const Card = require("../models/card");

const ERROR_CODE_DUPLICATE_MONGO = 11000;

module.exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find({});
        return res.send(cards);
    } catch (error) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.createCard = (req, res) => {
        const { name, link } = req.body;
        console.log(req.user._id); // _id станет доступен
        const ownerId = req.user._id;
        Card.create({ name, link, owner: ownerId })
        .then((newCard) => {
          res.status(201).send({ data: newCard });
        })

    .catch ((err) =>  {
        if (err.name === "ValidationError") {
            return res.status(400).send({ message: "Невалидные данные" });
        } else {
        next(err);
        }
    });
};

module.exports.deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(403).send({ message: "Карточка не найдена" });
        }
        await Card.findOneAndDelete(cardId);
        return res.send({ message: "Карточка удалилась" });
    } catch (err) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.likeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).send({ message: "Карточка не найдена" });
        }
        await Card.findByIdAndUpdate(
            req.params.cardId,
            { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
            { new: true }
        );
        return res.send({ message: "Лайк поставился" });
    } catch (err) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};

module.exports.dislikeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).send({ message: "Карточка не найдена" });
        }
        await Card.findByIdAndUpdate(
            req.params.cardId,
            { $pull: { likes: req.user._id } }, // убрать _id из массива
            { new: true }
        );
        return res.send({ message: "Лайк убрался" });
    } catch (err) {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
};
