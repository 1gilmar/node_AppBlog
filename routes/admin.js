const express = require('express')
const router = express.Router()


router.get("/", (req, res) => {
    //res.send("Pagina de postes")
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Pagina de postes")
})

router.get("/categorias", (req, res) => {
    res.send("Página das categorias")
})
module.exports = router