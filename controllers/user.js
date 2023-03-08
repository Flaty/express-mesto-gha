const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  OK_CREATED_CODE,
  SUCCESS_CREATED_CODE,
} = require('../utils/constants');
// get users
module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка.' }));
};
// create user
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.status(SUCCESS_CREATED_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(INCORRECT_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.getlUserById = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Невалидный id ' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK_CREATED_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({
          message: 'ереданы некорректные данные.',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};
