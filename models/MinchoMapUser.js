const mongoose = require('mongoose');

const minchomapUserSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nickname : { type: String, required: true },
  profile_image: { type: String },
  email : { type: String, required: true }
});

module.exports = mongoose.model('minchomapUsers', minchomapUserSchema);
