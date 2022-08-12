const router = require('express').Router();
const {
  getCards,
  addCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', addCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
