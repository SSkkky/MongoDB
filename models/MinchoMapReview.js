const mongoose = require('mongoose');

const minchomapReviewSchema = new mongoose.Schema({
  email: String,
  date: String,
  review: String,
  rate: Number,
  nickname: String,
  profile_image: String
})

module.exports = mongoose.model('minchomapReviews', minchomapReviewSchema);
