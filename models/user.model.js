const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    email: { type: String, require: true},
    senha: { type: String, required: false, select: false},
    tokenGoogle: { type: String, require: false},
});


UserSchema.pre('save', async function(next){
    if(this.senha){
        const hash = await bcrypt.hash(this.senha, 10);
        this.senha = hash;
        next();
    } 
});


module.exports = User = mongoose.model('User', UserSchema);
