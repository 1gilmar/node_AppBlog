const express = require('express')
const router = express.Router()


router.get("/", (req, res) => {
    //res.send("Pagina de postes")
    res.render("admin/index")
})

router.get("/categorias", (req, res) => {
    res.render("admin/categorias")
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})

router.get("/posts", (req, res) => {
    res.send("Pagina de postes")
})
module.exports = router