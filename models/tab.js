const mongoose = require("mongoose");

const tabSchema = new mongoose.Schema({
  userAId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userBId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  transactions: [],
  pendingTransactions: [],
  unverifiedTransactions: [],
});

tabSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Tab", tabSchema);
