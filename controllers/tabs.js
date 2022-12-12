const tabsRouter = require("express").Router();
const Tab = require("../models/tab");
const User = require("../models/user");

tabsRouter.get("/", async (req, res) => {
  const tabs = await Tab.find({})
    .populate("userAId", {
      username: true,
      name: true,
      id: true,
    })
    .populate("userBId", { username: true, name: true, id: true });
  res.json(tabs);
});

tabsRouter.post("/", async (req, res) => {
  const { userId } = req.body;
  const self = req.user;
  const user = await User.findById(userId);
  const tab = new Tab({
    userAId: self._id,
    userBId: user._id,
    amount: 0,
    transactions: [],
    pendingTransactions: [],
    unverifiedTransactions: [],
  });
  await tab.save();
  self.tabs = sself.tabs.concat(tab._id);
  user.tabs = user.tabs.concat(tab._id);
  await self.save();
  await user.save();
  res.status(201).json(tab);
});

module.exports = tabsRouter;
