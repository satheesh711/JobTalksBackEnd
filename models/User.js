const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  method: String,
  role: String,
  experience: String,
  occupation: String,
  location: String,
  phone: String
});

module.exports = mongoose.model('User', userSchema);