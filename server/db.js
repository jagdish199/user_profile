const mongoose = require("mongoose")
require('dotenv').config();

const mongoURL = process.env.MONGOOSE_URL;

const connectToMongo=()=>{
    mongoose.connect(mongoURL);
}

module.exports = connectToMongo;