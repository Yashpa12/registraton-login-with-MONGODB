const mongoose = require('mongoose')
const monogoURL = process.env.MONGO_URL


mongoose.connect(monogoURL).then(()=>{
    console.log('connection');
}).catch((err)=>{
    console.log("no connection");
})