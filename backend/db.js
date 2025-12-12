const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/enotebook";              //Connecting mongoose server with backend with same ip
mongoose.set('strictQuery', true);
/*const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo successfully");
    })
};
module.exports = connectToMongo
*/
const connectToMongo = async () => {
    try {
      await mongoose.connect(mongoURI); // no options needed in Mongoose 7+
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  };
  
  module.exports = connectToMongo;