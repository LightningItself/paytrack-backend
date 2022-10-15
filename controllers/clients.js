const clientsRouter = require("express").Router();
const Client = require("../models/client");
const User = require("../models/user");

clientsRouter.get("/", async (req, res) => {
  const clients = await Client.find({}).populate("user", {
    name: 1,
    username: 1,
    id: 1,
  });
  res.json(clients);
});

clientsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const client = await Client.findById(id);
    if (client) {
      res.json(client);
    }
  } catch (err) {
    next(err);
  }
});

clientsRouter.post("/", async (req, res, next) => {
  const { name } = req.body;

  const user = await User.findById(req.user.id);

  const client = new Client({
    name: name,
    amount: 0,
    user: user._id,
  });
  try {
    const savedClient = await client.save();
    user.clients = user.clients.concat(savedClient._id);
    await user.save();
    res.json(savedClient);
  } catch (err) {
    next(err);
  }
});

clientsRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const client = {
    amount: body.amount,
  };
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, client, {
      new: true,
    });
    res.json(updatedClient);
  } catch (err) {
    next(err);
  }
});

clientsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Client.findByIdAndRemove(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: "failed to delete client" });
  }
});

module.exports = clientsRouter;
