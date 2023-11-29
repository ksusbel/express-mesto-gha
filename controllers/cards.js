const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DeleteCardError = require('../errors/DeleteCardError');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // console.log(req.user._id); // _id станет доступен
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.status(201).send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Невалидные данные'));
        //  return res.status(400).send({ message: 'Невалидные данные' });
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
      // return res.status(404).send({ message: 'Карточка не найдена' });
    }
    if (card.owner._id.toString() !== req.user._id) {
      throw new DeleteCardError('Нельзя удалить чужую карточку!');
      // return res.status(403).send({ message: 'Нельзя удалить чужую карточку!' });
    }
    await Card.findOneAndDelete(cardId);
    return res.status(200).send({ message: 'Карточка удалилась' });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
      // return res.status(404).send({ message: 'Карточка не найдена' });
    }
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    return res.send({ message: 'Лайк поставился' });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
      // return res.status(404).send({ message: 'Карточка не найдена' });
    }
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    return res.send({ message: 'Лайк убрался' });
  } catch (err) {
    next(err);
  }
};
