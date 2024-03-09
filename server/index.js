const express = require("express")

require('dotenv').config();

const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({extended:false}))


app.get("/",(req,res)=>{
    return res.end("jagdish dawar")
})
app.listen(port,()=> console.log(`Server listen at port : ${port}`))

