const NotFoundError = require('../error/NotFoundError');
const RequestError = require('../error/RequestError');
const DeleteAccessError = require('../error/DeleteAccessError');

const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new RequestError('Некорректные данные карточки'));
    }
    next(err);
  }
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new DeleteAccessError('Вы не можете удалить чужую карточку');
      }
      return card.remove()
        .then(() => res.status(200).send({ data: card, message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new RequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
