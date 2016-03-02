/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const articleSchema = new Schema({
  username: String,
  password: String,
  created: Number
});
const Users = mongoose.model('users', articleSchema);

export default Users;
