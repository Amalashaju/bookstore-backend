//import mongoose
const mongoose = require('mongoose')

//schema

const bookschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    noofpages:{
        type:Number,
        required:true
    },
    imageurl:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    dprice:{
        type:Number,
        required:true
    },
    abstarct:{
        type:String,
        required:true
    },
    
    publisher:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    uploadedImages:{
        type:Array,
        required:true
    },
    status:{
        type:String,
       default:'pending'
    },
    userMail:{
        type:String,
        required:true
    },
    brought:{
        type:String,
        default:""
    },
})
const books = mongoose.model("books",bookschema)
module.exports = books