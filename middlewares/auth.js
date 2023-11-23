const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {

    console.log(req.headers);
    const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация2' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log(payload);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация1' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше

};