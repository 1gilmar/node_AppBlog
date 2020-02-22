const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

const {eAdmin} = require('../helpers/eAdmin')

router.get("/", eAdmin, (req, res) => {
    //res.send("Pagina de postes")
    res.render("admin/index")
})

router.get("/posts", eAdmin, (req, res) => {
    res.send("Pagina de posts...")
})

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().sort({ nome: 'desc' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("Erro ao mostrar as categorias")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) => {
    var arryerros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        arryerros.push({ textoerro: "Texto invalido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        arryerros.push({ textoerro: "Slug inválido" })
    }

    if (arryerros.length > 0) {
        res.render("admin/addcategorias", { erros: arryerros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criado com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar categoria")
            res.redirect("/admin")
        })
    }

})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((erro) => {
        req.flash("error_msg", "Categoria não encontrada")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

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
        req.flash("error_msg", "Erro ao editar categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletado com sucesso")
        res.redirect("/admin/categorias")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) => {
    //"catetoria" e o nome do campo que demos na tabela postagens
    Postagem.find().populate("categoria").sort({ dataCriacao: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao buscar postagens")
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagens", { categorias: categorias })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao buscar a categoria")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
    var erros = []

    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "titulo invalido" })
    }

    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria invalida, registre uma categoria" })
    }

    if (erros.length > 0) {
        res.render("admin/addpostagens", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            conteudo: req.body.conteudo
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criado com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar postagem")
            res.redirect("/admin")
        })
    }

})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {
        Categoria.find().then((categorias) => {

            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })

        }).catch((errCategoria) => {
            req.flash("error_msg", "Erro ao lista as categorias")
        })
    }).catch((errPostagem) => {
        req.flash("error_msg", "Erro ao buscar a postagem pelo id")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit", eAdmin, (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.categoria = req.body.categoria
        postagem.conteudo = req.body.conteudo

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem atualizada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao atualizar a postagem")
            res.redirect("/admin/categorias")
        })

    }).catch((erros) => {
        req.flash("error_msg", "Erro ao buscar a postabem pelo id da pagina hidden")
        res.redirect("/admin/categorias")
    })
})

router.post("/postagens/deletar", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem deletado com sucesso")
        res.redirect("/admin/postagens")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar postagem")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletarget/:id", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.params.id })
})

router.get("/teste", (req, res) => {
    res.send("Testando url")
})

module.exports = router