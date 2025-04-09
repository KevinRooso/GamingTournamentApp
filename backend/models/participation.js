const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Tournament = require('./tournament');

// Participation Model
const Participation = sequelize.define('Participation',{
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  }  
},{
  tableName: 'participations',
  timestamps: true,
  underscored: true
});

//Relationships
Participation.belongsTo(User,{
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE' // Deletes the participation on deletion of User
});

Participation.belongsTo(Tournament,{
  foreignKey: 'tournament_id',
  targetKey: 'id',
  onDelete: 'CASCADE' // Deletes the participation on deletion of Tournament
})

// Sync the model with database (Creates table if it does not exist)
Participation.sync().then(
  ()=>{
    console.log('Participation model synced with database')
  }
).catch((err)=>{
  console.log('Error syncing Participation model with database',err)
});


module.exports = Participation;