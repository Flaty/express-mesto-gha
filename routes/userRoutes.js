const userRoutes = require('express').Router();

const {
  getUsers,
  createUser,
  getlUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUsers);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);
module.exports = userRoutes;