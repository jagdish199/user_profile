const express = require("express")
const path = require("path")
const user = require("./routes/user")
require('dotenv').config();

const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve("./public")))

app.use("/",user);
app.listen(port,()=> console.log(`Server listen at port : ${port}`))

