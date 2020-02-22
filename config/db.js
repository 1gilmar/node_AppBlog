if(process.env.NODE_ENV == "production"){
    module.exports = {montoURL: "mongodb+srv://root:jiraspiom@cluster0-2gq4v.gcp.mongodb.net/test?retryWrites=true&w=majority" }
}else{
    module.exports = {mongoURL: "mongodb://localhost:27017/blogapp"}
}