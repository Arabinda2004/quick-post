const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,
    age: Number,
    password: String,
    profilepic: {
        type: String,
        default: 'default.png'
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
})

module.exports = mongoose.model('user', userSchema);