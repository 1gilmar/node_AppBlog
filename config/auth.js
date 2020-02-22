const localStrategi = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcript = require("bcryptjs")

//Model de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = (passport)=>{
    passport.use(new localStrategi({usernameField: email}, (email, senha, done)=>{
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcript.compare(senha. usuario.senha, (erro, batem)=>{
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })

        })

    }))

    passport.serializeUser((usuario, done)=>{
        return done(usuario.id)
    })

    passport.deserializeUser((usuario, done)=>{
        User.findById(id, (err, usuario)=>{
            done(err, user)
        })
    })

}
