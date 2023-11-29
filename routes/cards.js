const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

//  GET /cards — возвращает все карточки
cardRouter.get('/', auth, getCards);

//  POST /cards — создаёт карточку
cardRouter.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
cardRouter.delete(
  '/:cardId',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCard,
);

// PUT /cards/:cardId/likes — поставить лайк карточке
cardRouter.put(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  likeCard,
);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
cardRouter.delete(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
