const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const {
  notFoundCode,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use('/users', userRoutes);

app.use('/cards', cardRoutes);

app.use('*', (req, res) => {
  res.status(notFoundCode).send({
    message: 'Запрашиваемый адрес страницы не существует.',
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
