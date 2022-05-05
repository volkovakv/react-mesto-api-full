const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getAllUsers, getMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
usersRouter.get('/', getAllUsers);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).required()
      .regex(
        /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/,
      ),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
