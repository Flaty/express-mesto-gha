const cardRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  getLikes,
  deleteLikes,
} = require('../controllers/card');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', getLikes);
cardRoutes.delete('/:cardId/likes', deleteLikes);
module.exports = cardRoutes;
