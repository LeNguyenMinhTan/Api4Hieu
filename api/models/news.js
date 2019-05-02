const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    newsImage:{type: String}
});

module.exports = mongoose.model('News', newsSchema);