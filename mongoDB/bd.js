const mongoose = require('mongoose');
require("dotenv").config();
// mongoose.connect('mongodb://localhost:27017/achapet', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;

// module.exports = mongoose;


const URI = process.env.MONGO_URL;

const connectDB = async() =>{
    await mongoose.connect(URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    console.log('Banco conectado')
};
module.exports = connectDB;
