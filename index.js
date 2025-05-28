//import dotenv file
require('dotenv').config()//load environment
//import express library
const express = require('express')
//import cors library
const cors = require('cors')
//import route
const route = require('./routes')
//import db connection file
require('./databaseconnection')

//create the server - express()
const bookstoreServer = express()

//server using cors
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) // to parse json - middleware
bookstoreServer.use(route)

//export the uploads folder from the server side
bookstoreServer.use('/upload',express.static('./uploads'))

//export the uploads folder from the server side
bookstoreServer.use('/pdfUpload',express.static('./pdfUploads'))


//create port
PORT = 4000 || process.env.PORT

//port listen
bookstoreServer.listen(PORT , ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})