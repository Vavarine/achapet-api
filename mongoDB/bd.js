const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/achapet', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;

// module.exports = mongoose;


const URI = 'mongodb+srv://karinaCorrotti:ka286445@clustertcc.5ans6.mongodb.net/achapet?retryWrites=true&w=majority';

const connectDB = async() =>{
    await mongoose.connect(URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    console.log('Banco conectado')
};
module.exports = connectDB;
