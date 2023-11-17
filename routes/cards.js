const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
  } = require('../controllers/cards');

//GET /cards — возвращает все карточки
cardRouter.get('/', getCards);

//POST /cards — создаёт карточку
cardRouter.post('/', createCard);

//DELETE /cards/:cardId — удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCard);

//PUT /cards/:cardId/likes — поставить лайк карточке
cardRouter.put('/:cardId/likes', likeCard);

//DELETE /cards/:cardId/likes — убрать лайк с карточки
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports =  cardRouter;