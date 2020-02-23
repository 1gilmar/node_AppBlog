if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURL: "mongodb+srv://usuario:5HboYDJVrtkpEIhJ@cluster0-jzfpn.gcp.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURL: "mongodb://localhost:27017/blogapp"}
}