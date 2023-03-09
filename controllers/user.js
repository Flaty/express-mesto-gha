const User = require('../models/user');
const {
  notFoundCode,
  defaultCode,
  incorrectCode,
} = require('../utils/constants');
// get users
module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch(() => res.send({ message: 'Произошла ошибка.' }));
};
// create user
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(notFoundCode)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.getlUserById = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(notFoundCode).send({ message: 'Пользователь не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectCode).send({ message: 'Невалидный id ' });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(incorrectCode).send({
          message: 'ереданы некорректные данные.',
        });
      }
      return res.status(defaultCode).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFoundCode).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectCode).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(defaultCode).send({ message: 'Произошла ошибка.' });
      }
    });
};
