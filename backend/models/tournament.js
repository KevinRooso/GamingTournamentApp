const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig');

const Tournament = sequelize.define('Tournament' ,{
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gameType: {
    type: DataTypes.STRING(50),   // Adjust length as needed
    allowNull: false
  },
  startDate:{
    type: DataTypes.DATE,
  },
  endDate:{
    type: DataTypes.DATE,
  },
  maxParticipants:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  tableName: 'tournaments',
  timestamps: true,
  underscored: true, // Automatically convert camelCase to snake_case
});

// Sync the model with database (Creates table if it does not exist)
Tournament.sync().then(
  ()=>{
    console.log('Tournament model synced with database')
  }
).catch((err)=>{
  console.log('Error syncing Tournament model with database',err)
});

module.exports = Tournament;