//import mongoose
const mongoose = require('mongoose')

//create scheme

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profile:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:'Bookstore user'
    }
})

const users = mongoose.model("users",userSchema)
module.exports = users