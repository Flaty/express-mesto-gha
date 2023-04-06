const userRoutes = require('express').Router();

const {
  getUsers,
  getlUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validation');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', validationUserId, getlUserById);
userRoutes.patch('/me', validationUpdateUser, updateUser);
userRoutes.patch('/me/avatar', validationUpdateAvatar, updateAvatar);
module.exports = userRoutes;
