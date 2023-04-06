const BadRequestError = require('../errors/bad-request-errors');
const NotFoundError = require('../errors/not-found-errors');

module.exports.getUserInfo = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(next);
}

// get users
module.exports.getUsers = (req, res, next) => {
  const { _id } = req.user;
  User
    .find({ _id })
    .then((user) => res.status(200).send({ data: user[0] }))
    .catch(next);
};
// create user
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      { name, about, avatar, email, password: hash },
    ))
    .then((user) => {
      const userWithOutPassword = user.toObject();
      delete userWithOutPassword.password;
      res.status(201).send(userWithOutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(`Пользователь с таким email уже существует!`));
        return;
      }
      next(err);
    });
};

module.exports.getlUserById = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрошенный пользователь не найден');
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Идентификатор пользователя не найден`);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При обновлении профиля переданы неверные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Идентификатор пользователя неверен'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с идентификатором ${userId} не найден`);
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data passed when updating profile'));
        return;
      }       
      if (err.name === 'CastError') {
        next(new BadRequestError('Идентификатор пользователя неверен'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильная почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token, name: user.name, email: user.email });
    })
    .catch(next);
};
