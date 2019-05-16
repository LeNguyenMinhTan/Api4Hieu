const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    email: { 
        type: String, 
        required: true,
        trim: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    },
    phone: { 
        type: String ,
        match: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i 
    },
    name: { type: String},
    address: { type: String },
    password: { type: String, trim: true},
    created: Date,
    // content: String,
    // room: String
});

module.exports = mongoose.model('User', userSchema);