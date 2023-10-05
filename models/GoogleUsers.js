const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: 'N/A'
    },
},
    {
        timestamps: true
    });


module.exports = mongoose.model('GoogleUsers', userSchema, 'GoogleUsers');