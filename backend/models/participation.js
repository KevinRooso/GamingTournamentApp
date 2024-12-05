const db = require("../config/dbConfig");

// Participation TABLE CREATION
db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS participations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tournament_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `,
    (err) => {
      if (err) {
        console.error("Error creating participations table:", err.message);
      } else {
        console.log("Participations table is ready!");
      }
    }
  );
});

// Create a Participation
const createParticipation = (participationData) => {
  return new Promise((resolve, reject) => {
    const { tournament_id, user_id } = participationData;

    const query = `INSERT INTO participations (tournament_id, user_id) 
        VALUES (?,?)`;
    const values = [tournament_id, user_id];

    db.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, tournament_id, user_id });
    });
  });
};

// Get Participation by Tournament
const getParticipationsByTournament = (tournamentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.*, u.username, u.name, t.name AS tournament_name
      FROM participations p
      JOIN users u ON p.user_id = u.id
      JOIN tournaments t ON p.tournament_id = t.id
      WHERE p.tournament_id = ?
    `;
    const values = [tournamentId];

    db.all(query, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Get User's Participations
const getUserParticipations = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.*, t.name as tournament_name, t.game_type, t.start_date 
      FROM participations p
      JOIN tournaments t ON p.tournament_id = t.id
      WHERE p.user_id = ?
    `;
    const values = [userId];

    db.all(query, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Check if User is Already Participating
const checkUserParticipation = (tournamentId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM participations 
      WHERE tournament_id = ? AND user_id = ?
    `;
    const values = [tournamentId, userId];

    db.get(query, values, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Cancel Participation
const cancelParticipation = (participationId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM participations WHERE id = ? AND user_id = ?`;
    const values = [participationId, userId];

    db.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: participationId });
    });
  });
};

module.exports = {
  createParticipation,
  getParticipationsByTournament,
  getUserParticipations,
  checkUserParticipation,
  cancelParticipation,
};
