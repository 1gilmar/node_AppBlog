//npm install --save express
//npm install --save express-handlebars
//npm install --save body-parser
//npm install --save mongoose
//npm install --save express-session
//npm install --save connect-flash
//npm install --save bcryptjs
//npm install --save passport
//npm install --save passport-local

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const usuario = require("./routes/usuario")
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")

const passport = require("passport")
require("./config/auth")(passport) //podemos usar o parametro passport por que o mesmo esta no export do arquivo auth, logo depois do igual.

//"function()" e mesma coisa que "() =>" ou seja, aerofunction.
//configuracao
    //sessao 
    app.use(session({
        secret: "qualquercoisa",
        resave: false,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    
    //sempre deve ser depois da session
    app.use(flash())
    
    //Configurando o middleware
    app.use((req, res, next) => {
        //criando variavel global
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
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
app.use('/admin', admin)
app.use('/usuario', usuario)

app.get("/", (req, res) => {
    Postagem.find().populate("categoria").sort({dataCriacao: "desc"}).then((postagens)=>{
        res.render("index", { postagens: postagens})
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao carregar as postagens")
        res.render("/404")
    })
})
app.get("/404", (req, res) =>{
    res.render("Erro 404")
})

app.get("/postagem/:slug", (req, res) =>{
    Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{          
            req.flash("error_msg", "essa postagem nao existe")
            res.redirect("/")
        }
    }).catch((erro) =>{
        req.flash("error_msg", "postagem nao achou o slug")
        res.redirect("/")
    })
})

app.get("/categoria", (req, res) =>{
    Categoria.find().then((categorias) => {
        res.render("categoria/index", {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "erro ao carregar a categoria")
        res.redirect("/")
    })  
})

app.get("/categoria/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
               res.render("categoria/postagens", {postagens: postagens, categoria: categoria})
            })

        }else{
            req.flash("error_msg", "essa categoria não existe")
            res.redirect("/")
        }
    }).catch((erro)=>{
        req.flash("error_msg", "erro ao carregar o slug")
        res.redirect("/")
    })
})

//outros
const PORTA = 3001
app.listen(PORTA, () => {console.log("Servidor rodando...")});
