const jwt = require('jsonwebtoken');


const { JWT_SECRET, NODE_ENV } = process.env;
module.exports = (req, res, next) => {
  let payload;
  try {
    // const token = req.headers.authorization;
    const token = req.cookies.parrotToken;

    if (!token) {
      throw new Error("NotAutanticate");
    }

    const validTocken = token.replace("Bearer ", "");
    payload = jwt.verify(validTocken, NODE_ENV ? JWT_SECRET : "dev_secret");
  } catch (err) {
    if (err.message === "NotAutanticate") {
      return res
        .status(401)
        .send({ message: "Не правильные email или password" });
    }

    if ((err.name = "JsonWebTokenError")) {
      return res.status(401).send({ message: "С токеном что-то не так" });
    }

    return res.status(500).send(err);
  }

  req.user = payload;
  next();
}