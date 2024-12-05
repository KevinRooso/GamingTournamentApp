const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname,'../data/mydatabase.db'), err=>{
    if(err){
        console.log('Error connecting to database',err.message);
    }else{
        console.log('Connected to database');        
    }
});

module.exports = db;