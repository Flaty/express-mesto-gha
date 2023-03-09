const Card = require('../models/card');
const {
  notFoundCode,
  defaultCode,
  incorrectCode,
} = require('../utils/constants');
// return all cards
module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(defaultCode).send({ message: 'Возникла ошибка.' }));
};
// create card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send({card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectCode).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};
// delete Card
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findOneAndRemove({ _id: cardId})
    .then((card) => {
      if (!card) {
        return res.status(notFoundCode).send({ message: 'Передан неверный _id' });
      }
      return res.send({card});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectCode).send({
          message: 'Карточка не найдена',
        });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};
// setLike
module.exports.getLikes = (req, res) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFoundCode).send({ message: 'Передан несуществующий _id ' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectCode).send({ message: 'Невалидный id ' });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};
// unSetLike
module.exports.deleteLikes = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(notFoundCode).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectCode).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(defaultCode).send({ message: 'Ошибка.' });
      }
    });
};
