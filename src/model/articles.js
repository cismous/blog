/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const articleSchema = new Schema({
  cid: Number,
  title: String,
  slug: String,
  text: String,
  created: Number
});
const Articles = mongoose.model('articles', articleSchema);

export default Articles;
