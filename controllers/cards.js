const Card = require('../models/card');
const {
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');

// get all cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch(next);
};

// add a new card
module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({
      data: card,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// delete card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({
          data: card,
        });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({
        message: 'Карточка с таким id не найдена',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id карточки' });
        return;
      }
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id карточки' });
        return;
      }
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
