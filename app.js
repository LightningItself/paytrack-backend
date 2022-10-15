const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const clientsRouter = require("./controllers/clients");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

logger.info("connecting to mongoDB server...");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to mongoDB.");
  })
  .catch((err) => {
    logger.error("failed to connect to mongoDB: ", err.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/clients", middleware.userExtractor, clientsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
