//npm install --save express
//npm install --save express-handlebars
//npm install --save body-parser
//npm install --save mongoose
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const app = express();

//configuracao
    //bodyParse
    app.use(bodyParse.urlencoded({extended: true}));
    app.use(bodyParse.json);

    //handlebars
    app.use('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //mongoose
    

//rotas

//outros
const PORTA = 3001
app.listen(PORTA, () => {
    console.log("Servidor rodando...")
})
