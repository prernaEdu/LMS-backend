const mongo = require('mongoose')
const schema = mongo.Schema;

const userSchema = new schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    accountType: {
        type: String,
        default: 'student'
    },
});

const users = mongo.model('users', userSchema, 'users');
module.exports = users;