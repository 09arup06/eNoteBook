const mongoose = require('mongoose');
const { Schema } = mongoose;
const MessageSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    suser:{
        type:String,
        required:true
    },                                          //Message has these following attributes
    ruser: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true,
    },
    date: { type: Date, default: Date.now },

});
const Msg = mongoose.model('message', MessageSchema);
module.exports = Msg