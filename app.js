const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const tabsRouter = require("./controllers/tabs");
const loginRouter = require("./controllers/login");
const transactionsRouter = require("./controllers/transactions");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const transaction = require("./models/transaction");

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

app.use("/api/users", usersRouter);
app.use("/api/tabs", middleware.userExtractor, tabsRouter);
app.use("/api/transactions", middleware.userExtractor, transactionsRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
