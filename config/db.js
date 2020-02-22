if(process.env.NODE_ENV == "production"){
    module.exports = {montoURL: "link do bando de dados online" }
}else{
    module.exports = {mongoURL: "mongodb://localhost:27017/blogapp"}
}