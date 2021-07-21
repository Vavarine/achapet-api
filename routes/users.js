const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/user.model');

router.post('/create', async(req, res) => {  //recebe um parametro com os dados do usuario e registra no banco de dados    
    if(!req.body.senha){ // verifica se o usuario tem uma senha
        return res.status(400).send({ error: 'Erro, senha vazia' });
    }else {
        try{          
          const { email } = req.body; 
            const user = await User.findOne({email}); //busca no banco de dados se já existe um user com este email      
            if(user){
              return res.status(400).send({ error: 'Email já cadastrado' }); // caso exista retorna um erro 400               
            }else{ 
              const user = await User.create(req.body); //caso não exista ele cria um user
              user.senha = undefined;   
              const token = jwt.sign({ senha: req.body.senha }, process.env.SECRET, { //assim que ele cadastra um usuario ele já cria um token
                expiresIn: 300 // tempo que expira o token do usuario 5 min
              });
              return res.send({ auth: true, user, token }); //se o cadastro for feito com sucesso, ele retorna a autorização true e o token, junto com dados do usuario            
            }            
          }catch(error){            
            return res.status(400).send({ error: 'Erro no registro' });    
          }
    }    
});

router.post('/authenticate', async(req, res) =>{     
    const { email, senha } = req.body; 
    if(!req.body.senha && !req.body.tokenGoogle){ // verifica se o usuario tem uma senha ou tokenGoogle
      return res.status(400).send({ error: 'Erro senha e token vazios' });
    }else{
      if(req.body.tokenGoogle && !req.body.senha){ // verifica se não tem senha, caso não tiver o usuario esta entrando com o google
        const user = await User.findOne({email}).select('+tokenGoogle'); // procura no banco um usuario com o mesmo email e trás junto com o tokenGoogle gravados
        //tentando logar ou criar via google
        if(!user){ // caso não ache um usuario com esta senha ele cria um novo
          const user = await User.create(req.body);
          const token = jwt.sign({ tokenGoogle: req.body.tokenGoogle }, process.env.SECRET, { //assim que ele cadastra um usuario ele já cria um token
            expiresIn: 300 // tempo que expira o token do usuario 5 min
          });
          return res.send({ auth: true, user, token });  //se o cadastro for feito com sucesso, ele retorna a autorização true e o token, junto com dados do usuario 
        }else{          
          const token = jwt.sign({ tokenGoogle: req.body.tokenGoogle }, process.env.SECRET, { //assim que ele logar um usuario ele já cria um token
            expiresIn: 300 // tempo que expira o token do usuario 5 min
          });
          return res.send({ auth: true, user, token });  //se o login for feito com sucesso, ele retorna a autorização true e o token, junto com dados do usuario 
        }
      }else if (!req.body.tokenGoogle && req.body.senha){ // verifica se não tem tokenGoogle, caso não tiver o usuario esta entrando com o login normal com senha
        const user = await User.findOne({email}).select('+senha');
        if(!user.senha)
          return res.status(400).send({error: 'Usuario já tem cadastro pela google'}); //caso o usuario digiti um email no login, porem ele já tenha um email cadastrado só que pelo google 
        //tentando fazer login normal  
        if(!user)
          return res.status(400).send({error: 'Usuario nao encontrado'});      
        if(!await bcrypt.compare(senha, user.senha))//descriptografa a senha para a comparação, await é por causa da função ser assincrona, promise
          return res.status(400).send({error: 'Senha invalida'});  
        const token = jwt.sign({ senha: req.body.senha }, process.env.SECRET, { 
          expiresIn: 300 
        });
        res.send({auth: true, user, token});
      }else {        
        return res.status(400).send({ error: 'Login indevido' }); 
      }
    }
});


function verifyJWT(req, res, next){  
  const token = req.headers['x-access-token']; //Aqui eu obtive o token a partir do cabeçalho x-access-token, que se não existir já gera um erro logo de primeira
  if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) { //verificamos a autenticidade desse token usando a função verify, usando a variável de ambiente com o SECRET. Caso ele não consiga verificar o token, irá gerar um erro
    if (err) return res.status(403).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    // req.userId = decoded.senha;
    // console.log(req.userId);
    next();
  });
}

router.get('/client', verifyJWT, async(req, res, next) =>{ // GET de teste
  // console.log('body do get:', req.userId);
  console.log("Retornou todos clientes!");  
});

router.post('/logout', async(req, res) =>{  // logout do sistema
  res.send({auth: false, token: null})
});

module.exports = app => app.use('/users', router);