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

// module.exports.deleteCard = (req, res, next) => {
//   Card.findById(req.params.cardId).populate('owner').then((card) => {
//     if (card) {
//       if (card.owner._id.valueOf() === req.user._id) {
//         Card.findByIdAndRemove(req.params.cardId)
//           .then((cardRemoved) => {
//             res.send({ data: cardRemoved });
//           });
//       } else {
//         throw new ForbiddenError('Отказано в доступе');
//       }
//     } else {
//       throw new NotFoundError('Запрашиваемая карточка не найдена');
//     }
//   }).catch((err) => {
//     if (err.name === 'CastError') {
//       throw new BadRequestError('Передан некорректный id карточки');
//     }
//     next(err);
//   })
//     .catch(next);
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку!');
      }
      return card.remove().then(res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
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
