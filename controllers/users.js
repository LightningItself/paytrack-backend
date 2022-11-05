const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const config = require("../utils/config");

usersRouter.get("/", async (req, res, next) => {
  const users = await User.find({}).populate("tabs");
  res.json(users);
});

usersRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    res.status(400).json({ error: "user not found" });
  }
  res.json(user);
});

usersRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;
  const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS);

  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
    tabs: [],
    completedTransactions: [],
    pendingTransactions: [],
    unverifiedTransactions: [],
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await User.findByIdAndRemove(id);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
