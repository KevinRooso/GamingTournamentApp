const db = require("../config/dbConfig");

// Match TABLE CREATION
db.serialize(() => {
  db.run(
    `
          CREATE TABLE IF NOT EXISTS matches (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              tournament_id INTEGER,
              player1_id INTEGER,
              player2_id INTEGER,
              winner_id INTEGER,
              score_player1 INTEGER,
              score_player2 INTEGER,
              match_date DATETIME NOT NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              round INTEGER,
              FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
              FOREIGN KEY (player1_id) REFERENCES users(id),
              FOREIGN KEY (player2_id) REFERENCES users(id),
              FOREIGN KEY (winner_id) REFERENCES users(id)
          )
      `,
    (err) => {
      if (err) {
        console.error("Error creating matches table:", err.message);
      } else {
        console.log("Matches table is ready!");
      }
    }
  );
});

// Create a match

const createMatch = (matchData) => {
  return new Promise((resolve, reject) => {
    const {
      tournament_id,
      player1_id,
      player2_id,
      winner_id,
      score_player1,
      score_player2,
      match_date,
      round
    } = matchData;

    const query = `INSERT INTO matches (tournament_id, player1_id, player2_id, winner_id, score_player1,
        score_player2, match_date,round) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    const values = [
      tournament_id,
      player1_id,
      player2_id,
      winner_id,
      score_player1,
      score_player2,
      match_date,
      round
    ];

    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, tournament_id, player1_id, player2_id });
    });
  });
};

// Get all Matches
const getAllMatches = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
          m.id, 
          m.score_player1, 
          m.score_player2, 
          m.match_date, 
          m.created_at, 
          m.updated_at,
          m.round,
          m.player1_id,
          m.player2_id,
          m.winner_id,
          t.name AS tournament_name, 
          p1.name AS player1_name,
          p2.name AS player2_name,
          winner.name AS winner_name     
      FROM 
          matches m
      JOIN 
          tournaments t ON m.tournament_id = t.id
      JOIN 
          users p1 ON m.player1_id = p1.id
      JOIN 
          users p2 ON m.player2_id = p2.id
      LEFT JOIN 
          users winner ON m.winner_id = winner.id;
    `;
    db.all(query, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Get match By Id
const getMatchById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM matches WHERE id = ?`;
    db.get(query, id, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Get matches By Tournament Id
const getMatchesByTournamentId = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          m.id, 
          m.score_player1, 
          m.score_player2, 
          m.match_date, 
          m.created_at, 
          m.updated_at,
          m.round,
          m.player1_id,
          m.player2_id,
          m.winner_id,
          t.name AS tournament_name, 
          p1.name AS player1_name,
          p2.name AS player2_name,
          winner.name AS winner_name          
      FROM 
          matches m
      JOIN 
          tournaments t ON m.tournament_id = t.id
      JOIN 
          users p1 ON m.player1_id = p1.id
      JOIN 
          users p2 ON m.player2_id = p2.id
      LEFT JOIN 
          users winner ON m.winner_id = winner.id
      WHERE 
        m.tournament_id = ?;
    `;
    db.all(query, [id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Update a match
const updateMatch = (id, matchData) => {
  return new Promise((resolve, reject) => {
    const {
      tournament_id,
      player1_id,
      player2_id,
      winner_id,
      score_player1,
      score_player2,
      match_date,
      round
    } = matchData;

    const query =
      `UPDATE matches SET tournament_id = ?, player1_id = ?, player2_id = ?, winner_id = ?, score_player1 = ?,
       score_player2 = ?, match_date = ?,round = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const values = [
      tournament_id,
      player1_id,
      player2_id,
      winner_id,
      score_player1,
      score_player2,
      match_date,
      round,
      id,
    ];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id, ...matchData });
    });
  });
};

// Update a match by simulation
const updateSimulateMatch = (id, matchData) => {
  return new Promise((resolve, reject) => {
    const {      
      winner_id,
      score_player1,
      score_player2,      
    } = matchData;

    const query =
      `UPDATE matches SET winner_id = ?, score_player1 = ?,
       score_player2 = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const values = [      
      winner_id,
      score_player1,
      score_player2,      
      id,
    ];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id, ...matchData });
    });
  });
};

// Delete a match
const deleteMatch = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM matches WHERE id = ?";
    db.run(query, id, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id });
    });
  });
};

// Get the maximum round number for a given tournament
const getMaxRoundForTournament = (tournament_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(round) AS max_round FROM matches WHERE tournament_id = ?`;
    db.get(query, [tournament_id], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row ? row.max_round : 0); // Returns 0 if no rounds exist yet
    });
  });
};

// Get winners for a specific round
const getWinnersOfRound = (tournament_id, round) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT winner_id 
      FROM matches 
      WHERE tournament_id = ? AND round = ? AND winner_id IS NOT NULL
    `;
    db.all(query, [tournament_id, round], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows.map(row => row.winner_id)); // Returns array of winner IDs
    });
  });
};

// Get the count of completed matches (those with winners) in a specific round
const getMatchesInRound = (tournament_id, round) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS round_matches
      FROM matches
      WHERE tournament_id = ? AND round = ?
    `;
    db.get(query, [tournament_id, round], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row ? row.round_matches : 0); // Return the number of matches with winners
    });
  });
};

const getMatchesByTournamentAndRound = (tournament_id, round) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * 
      FROM matches 
      WHERE tournament_id = ? AND round = ?;
    `;
    db.all(query, [tournament_id, round], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Get matches by User ID (player1_id or player2_id)
const getMatchesByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          m.id, 
          m.score_player1, 
          m.score_player2, 
          m.match_date, 
          m.created_at, 
          m.updated_at,
          m.round,
          m.player1_id,
          m.player2_id,
          m.winner_id,
          t.name AS tournament_name, 
          p1.name AS player1_name,
          p2.name AS player2_name,
          winner.name AS winner_name     
      FROM 
          matches m
      JOIN 
          tournaments t ON m.tournament_id = t.id
      JOIN 
          users p1 ON m.player1_id = p1.id
      JOIN 
          users p2 ON m.player2_id = p2.id
      LEFT JOIN 
          users winner ON m.winner_id = winner.id
      WHERE 
          m.player1_id = ? OR m.player2_id = ?;
    `;
    db.all(query, [userId, userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};


module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  getMatchesByTournamentId,
  updateMatch,
  deleteMatch,
  getMaxRoundForTournament,
  getWinnersOfRound,
  getMatchesByTournamentAndRound,
  updateSimulateMatch,
  getMatchesByUserId
};
