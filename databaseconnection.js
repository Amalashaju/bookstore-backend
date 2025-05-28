//import mongoose
const mongoose = require('mongoose')

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('mongodb connection successfully');
}).catch((err)=>{
    console.log(`mongodb connection failed or ${err}`);
    
})