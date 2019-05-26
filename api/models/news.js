const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    newsImage:{type: String},
    created_at: {type:Date, default: Date.now}
});

module.exports = mongoose.model('News', newsSchema);