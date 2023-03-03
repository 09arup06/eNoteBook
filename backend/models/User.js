const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({  
                                                               //User has the followinnng attributes and mail is the primary key
    name: {
        type:String,
        required:true
    },
    email:{
        type:String, 
        require:true,
        unique:true,
        
    },
    phone_number:{
        type:Number,
        require:true,
    },
    city:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now },
   
  });
  const User = mongoose.model('user',UserSchema);
  module.exports = User;