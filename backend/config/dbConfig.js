// Old SQLite Config
/* 
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
*/

// ORM Sequelize Config
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './data/mydatabase.db'
});

// Test the DB Connection
sequelize.authenticate().then(
    () => {
        console.log('Connected to SQLite Database');        
    }    
).catch(
    () => {
        console.log('Error connecting to SQLite Database');
    }
);

module.exports = sequelize;