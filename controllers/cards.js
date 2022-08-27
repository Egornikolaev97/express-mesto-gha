const Card = require('../models/card');
const ForbiddenError = require('../utils/ForbiddenError');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');

// get all cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch(next);
};

// add a new card
module.exports.addCard = (req, res, next) => {
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
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

// delete card
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Фотография не найдена'));
        return;
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        next(new ForbiddenError('Вы не можете удалить фотографию, созданную другим пользователем!'));
      } else {
        card.remove()
          .then(() => res.send({ message: 'Фотография удалена' }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный запрос'));
      }
      return next(err);
    });
};

// like card
module.exports.likeCard = (req, res, next) => {
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
      throw new NotFoundError('Карточка с таким id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id карточки');
      }
      next(err);
    })
    .catch(next);
};

// dislike card
module.exports.dislikeCard = (req, res, next) => {
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
      throw new NotFoundError('Карточка с таким id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id карточки');
      }
      next(err);
    })
    .catch(next);
};
