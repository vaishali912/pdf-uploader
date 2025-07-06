const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
})
module.exports =mongoose.model('User',User);