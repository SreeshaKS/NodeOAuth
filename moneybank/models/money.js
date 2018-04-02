var mongoose = require('mongoose');

var MoneySchema   = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  userId: String
});

module.exports = mongoose.model('Money', MoneySchema);