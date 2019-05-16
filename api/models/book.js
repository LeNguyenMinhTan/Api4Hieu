const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    user: { type: mongoose.SchemaTypes.ObjectId, ref:'User'},
    dateBook: { type: String},
    titleTest: { type: String },
    descTest: { type: String },
    location: { type: String},
    cost: { type: String},
    newsImage:{type: String}
});

module.exports = mongoose.model('Books', booksSchema);