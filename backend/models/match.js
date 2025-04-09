const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Tournament = require('./tournament');

const Match = sequelize.define('Match',{
  score_player1: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  score_player2: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  match_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  round: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  tableName: 'matches',
  timestamps: true,
  underscored: true
});

//Relationships
Match.belongsTo(User,{
  foreignKey: 'player1_id',
  targetKey: 'id',
  onDelete: 'CASCADE', // Deletes the participation on deletion of User
  as: 'player1'  
});

Match.belongsTo(User,{
  foreignKey: 'player2_id',
  targetKey: 'id',
  onDelete: 'CASCADE', // Deletes the participation on deletion of User
  as: 'player2' 
});

Match.belongsTo(User,{
  foreignKey: 'winner_id',
  targetKey: 'id',
  onDelete: 'CASCADE', // Deletes the participation on deletion of User
  as: 'winner'
});

Match.belongsTo(Tournament,{
  foreignKey: 'tournament_id',
  targetKey: 'id',
  onDelete: 'CASCADE', // Deletes the participation on deletion of Tournament
  as: 'tournament'
})

// Sync the model with database (Creates table if it does not exist)
Match.sync().then(
  ()=>{
    console.log('Match model synced with database')
  }
).catch((err)=>{
  console.log('Error syncing Match model with database',err)
});


module.exports = Match;