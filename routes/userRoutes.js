const userRoutes = require('express').Router();

const {
  getUsers,
  createUser,
  getlUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getlUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);
module.exports = userRoutes;
