//npm install --save express
//npm install --save express-handlebars
//npm install --save body-parser
//npm install --save mongoose
//npm install --save express-session
//npm install --save connect-flash
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagens = mongoose.model("postagens")

//"function()" e mesma coisa que "() =>" ou seja, aerofunction.
//configuracao
    //sessao 
    app.use(session({
        secret: "qualquercoisa",
        resave: false,
        saveUninitialized: true
    }))
    
    //sempre deve ser depois da session
    app.use(flash())
    
    //Configurando o middleware
    app.use((req, res, next) => {
        //criando variavel global
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //bodyParse
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json());

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/blogapp").then(() => {
        console.log("Conectado ao mongo db")
    }).catch((err) => {
        console.log("Erro ao conectar ao mongo db - erro: " + err)
    })

    //public
    app.use(express.static(path.join(__dirname, "public")))

//rotas
app.get("/", (req, res) => {
    Postagens.find().sort({dataCriacao: "desc"}).then((postagens)=>{
        res.render("index", { postagens: postagens})
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao carregar as postagens")
        res.render("/404")
    })
})
app.get("/404", (req, res) =>{
    res.render("Erro 404")
})

app.get("/posts", (req, res) =>{
    res.send("lista de posts")
})
app.use('/admin', admin)


//outros
const PORTA = 3001
app.listen(PORTA, () => {console.log("Servidor rodando...")});
