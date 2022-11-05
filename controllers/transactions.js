const transactionsRouter = require("express").Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");

transactionsRouter.get("/", async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
});

// transactionsRouter.post('/', async (req, res) => {

//   const transaction = new Transaction({

//   })
// })

module.exports = transactionsRouter;
