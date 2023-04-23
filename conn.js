require('dotenv').config();
const mongoose = require('mongoose');

const  uri = process.env.MONGO_DB

mongoose.connect(uri,{

}).then(()=>{
    console.log('DB connection successfully')
}).catch((err)=>{
    console.log(err)
})

module.exports = mongoose