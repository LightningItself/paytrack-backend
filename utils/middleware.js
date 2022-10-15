const logger = require("./logger");
const config = require("./config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:", req.path);
  logger.info("Body:", req.body);
  logger.info("------------");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  switch (err.name) {
    case "CastError": {
      return res.status(400).send({ error: "malformatted id" });
    }
    case "ValidationError": {
      return res.status(400).json({ error: err.message });
    }
    default: {
      next(err);
    }
  }
};

const userExtractor = async (req, res, next) => {
  const auth = req.get("authorization");
  if (!(auth && auth.toLowerCase().startsWith("Bearer "))) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const token = auth.substring(7);
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "incorrect token" });
  }
  const user = await User.findById(decodedToken.id);
  req.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
};
