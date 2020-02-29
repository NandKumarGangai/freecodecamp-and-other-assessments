const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');

const COLLECTION_NAME = 'tendays_collection';

const User = mongoose.model('User', userSchema, COLLECTION_NAME);

module.exports = User;