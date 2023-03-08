const Card = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  OK_CREATED_CODE,
} = require('../utils/constants');

//return all cards
module.exports.getCards = (req, res) => {
  Card
  .find({})
  .then(cards => res.status(OK_CREATED_CODE).send(cards))
  .catch(err => res.status(DEFAULT_ERROR_CODE).send({message: 'Возникла ошибка.'}))
};
//create card
module.exports.createCard = (req, res) => {
    const { name, link } = req.body;

    Card
      .create({ name, link, owner: req.user._id })
      .then(card => res.status(SUCCESS_CREATED_CODE).send(card))
      .catch(err => {
        if (err.name === 'ValidationError') {
          res.status(INCORRECT_DATA_ERROR_CODE).send({
            message: 'Переданы некорректные данные.'
          });
        } else {
          res.status(DEFAULT_ERROR_CODE).send({message: 'Произошла ошибка.'})
        }
    })
}
//delete Card
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findById(cardId)
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Передан неверный _id'})
      }
      return res.status(OK_CREATED_CODE).send(card);
    })
    .catch(err=> {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({
          message: 'Карточка не найдена'
        })
      } else {
        res.status(DEFAULT_ERROR_CODE).send({message: 'Произошла ошибка.'})
      }
    })
};
//setLike
module.exports.getLikes = (req, res) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then(card => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Передан несуществующий _id '})
    }
    return res.send({ card })
  })
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Невалидный id ' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка.' });
    }
  });
}
//unSetLike
module.exports.deleteLikes = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ card });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка.' });
      }
    })
};
