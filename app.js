//npm install --save express
//npm install --save express-handlebars
//npm install --save body-parser
//npm install --save mongoose
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')

//configuracao
    //bodyParse
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json());

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //mongoose

    //public
    app.use(express.static(path.join(__dirname, "public")))

//rotas
app.use('/admin', admin)

//outros
const PORTA = 3001
app.listen(PORTA, () => {console.log("Servidor rodando...")});
