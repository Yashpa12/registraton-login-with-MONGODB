const mongoose = require('mongoose')
const monogoURL = "mongodb://127.0.0.1:27017/yotubeRegistration"


mongoose.connect(monogoURL).then(()=>{
    console.log('connection');
}).catch((err)=>{
    console.log("no connection");
})