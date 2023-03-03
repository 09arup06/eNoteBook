const mongoose = require('mongoose');
const { Schema } = mongoose;
const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },                                           //Notes has these following attributes
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: { type: Date, default: Date.now },

});
const Note = mongoose.model('note', NoteSchema);
module.exports = Note