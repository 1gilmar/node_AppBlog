const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")


router.get("/", (req, res) => {
    //res.send("Pagina de postes")
    res.render("admin/index")
})

router.get("/categorias", (req, res) => {
    Categoria.find().sort({nome:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("Erro ao mostrar as categorias")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
    var arryerros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        arryerros.push({textoerro: "Texto invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        arryerros.push({textoerro: "Slug inválido"})
    }

    if(arryerros.length > 0){
        res.render("admin/addcategorias",{erros: arryerros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criado com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar categoria")
            res.redirect("/admin")
        })
    }

})

router.get("/categorias/edit/:id", (req, res) =>{
    Categoria.findOne({_id: req.params.id }).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})       
    }).catch((erro) => {
        req.flash("error_msg", "Categoria não encontrada")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria atualizada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao atualizar categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar categoria" )
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "Categoria deletado com sucesso")
        res.redirect("/admin/categorias")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req, res) => {
    res.render("admin/postagens")
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().then((categorias) =>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao bucar a categoria")
    })
})

router.post("/postagens/nova", (req, res) =>{
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }

    if (erros.length > 0 ){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            conteudo: req.body.coteudo
        }

        new Postagem(novaPostagem).save().then(() =>{
            req.flash("success_msg", "Postagem criado com sucesso")
            res.redirect("/admin/postagem")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar postagem")
            res.redirect("/admin")
        })

    }

})

router.get("/teste", (req, res) => {
    res.send("Testando url")
})

module.exports = router