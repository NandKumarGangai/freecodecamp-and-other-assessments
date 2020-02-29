const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_first_name: String,
    user_last_name: String, // String is shorthand for {type: String}
    user_password: String,
    user_date_of_birth: Date,
    user_contact_no: Number,
    user_email: String,
    user_date_account_created: { type: Date, default: Date.now },
    user_admin: { type: Boolean, default: false },
});

module.exports = userSchema;