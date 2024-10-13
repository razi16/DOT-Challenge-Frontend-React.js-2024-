const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  password: {
    type: String,
    required: true,
  },
  history: [
    {
      score: {
        type: Number,
      },
      time: {
        type: Date,
      },
    },
  ],
});

module.exports = new mongoose.model("user", userSchema, "user");
