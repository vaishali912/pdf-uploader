const mongoose = require('mongoose');
const { Schema } = mongoose;

const pdfschema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    pdf:{
       type:String,
       required:true
    },
    pdfname:{
        type:String,
        required:true
    },
    publicid:{
        type:String,
        required:true
    }
})
module.exports =mongoose.model('Pdf',pdfschema);