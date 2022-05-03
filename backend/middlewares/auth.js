const jwt = require('jsonwebtoken');
const IdError = require('../error/IdError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new IdError('Ошибка авторизации: токен не начинается с Bearer');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret1993key');
  } catch (err) {
    next(new IdError('Ошибка авторизации: не получилось верифицировать токен'));
  }

  req.user = payload;

  next();
};
