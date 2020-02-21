const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bccript = require("bcryptjs")

//usuarios
router.get("/registros", (req, res) => {
    res.render("usuario/registros", { Titulo: "pagina de usuarios" })
})

router.post("/registros", (req, res) => {
    var erros = []
    if (!req.body.usuario || typeof req.body.usuario == undefined || req.body.usuario == null) {
        erros.push({ texto: "Usuario inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida" })
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente" })
    }

    if (erros.length > 0) {
        res.render("usuario/registros", { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe usuario com este email!")
                res.redirect("/usuario/registros")
            } else {
                const novousuario = new Usuario({
                    nome: req.body.usuario,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bccript.genSalt(10, (erro, salt) => {
                    bccript.hash(novousuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento")
                            res.redirect("/usuario/registros")
                        }

                        novousuario.senha = hash

                        novousuario.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso")
                            res.redirect("/")
                        }).catch((erro) => {
                            req.flash("error_msg", "Houve um erro durante o salvamento")
                            res.redirect("/usuario/registros")
                        })
                    })
                })

            }
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao buscar usuario")
            res.redirect("/usuario/registros")
        })
    }
})

module.exports = router