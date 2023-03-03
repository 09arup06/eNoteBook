const mongoose = require('mongoose');
const mongoURI= "mongodb://127.0.0.1:27017/e-notes?directConnection=true"               //Connecting mongoose server with backend with same ip
mongoose.set('strictQuery', true);
const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo successfully");
    })
};
module.exports = connectToMongo