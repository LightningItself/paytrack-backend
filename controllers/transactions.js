const transactionsRouter = require("express").Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Tab = require("../models/tab");

transactionsRouter.get("/", async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
});

transactionsRouter.post("/", async (req, res) => {
  const self = req.user;
  const { tabId, amount, type, userId } = req.body;
  try {
    const tab = await Tab.findById(tabId);
    if (!tab) {
      return res.json("tab not found").end();
    }
    const userTabs = self.tabs;
    const tabCheck = userTabs.find((tab) => tab.toString() === tabId);
    if (!tabCheck) {
      return res.json("tab access restricted").end();
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.json("user not found").end();
    }
    const transaction = new Transaction({
      amount,
      isCompleted: type === "credit" ? true : false,
      sender: type === "credit" ? user._id : self._id,
      receiver: type === "credit" ? self._id : user._id,
      date: new Date(),
    });
    transaction.save();
    if (type === "credit") {
      //credit
      self.completedTransactions = self.completedTransactions.concat(
        transaction._id
      );
      await self.save();
      user.completedTransactions = user.completedTransactions.concat(
        transaction._id
      );
      await user.save();
      await transaction.save();
      tab.transactions = tab.transactions.concat(transaction._id);
      if (self._id.toString() === tab.userAId.toString()) {
        tab.amount = tab.amount + amount;
      } else {
        tab.amount = tab.amount - amount;
      }
      await tab.save();
      return res.json(transaction).end();
    } else {
      //debit
      self.pendingTransactions = self.pendingTransactions.concat(
        transaction._id
      );
      await self.save();
      user.unverifiedTransactions = user.unverifiedTransactions.concat(
        transaction._id
      );
      await user.save();
      await transaction.save();
      tab.pendingTransactions = tab.pendingTransactions.concat(transaction._id);
      await tab.save();
      return res.json(transaction).end();
    }
  } catch {
    return res.json("invalid tab").end();
  }
});

module.exports = transactionsRouter;
