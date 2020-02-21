const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const ItemSchema = new Scheme({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now()
    }
});
//minha colecao no mongo db vai se chamar postagens
mongoose.model("postagens", ItemSchema)
