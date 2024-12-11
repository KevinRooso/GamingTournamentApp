const db = require("../config/dbConfig");

// Tournament TABLE CREATION
db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            game_type TEXT NOT NULL,
            start_date DATETIME,
            end_date DATETIME,
            max_participants INTEGER NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `,
    (err) => {
      if (err) {
        console.error("Error creating tournaments table:", err.message);
      } else {
        console.log("Tournaments table is ready!");
      }
    }
  );
});

// Create a Tournament

const createTournament = (tournamentData) => {
  return new Promise((resolve, reject) => {
    const { name, gameType, maxParticipants } =
      tournamentData;

    const query = `INSERT INTO tournaments (name, game_type, max_participants) 
        VALUES (?,?,?)`;
    const values = [name, gameType, maxParticipants];

    db.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, name });
    });
  });
};

// Get All Tournaments
const getAllTournaments = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tournaments`;
    db.all(query, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Get Tournament By Id
const getTournamentById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tournaments WHERE id = ?`;
    const values = [id];
    db.get(query, values, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Update a tournament
const updateTournament = (id, tournamentData) => {
  return new Promise((resolve, reject) => {
    const { name, gameType, maxParticipants } =
      tournamentData;
    const query = `UPDATE tournaments SET name = ?, game_type = ?, max_participants = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const values = [
      name,
      gameType,
      maxParticipants,
      id,
    ];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id, name });
    });
  });
};

// Delete a tournament
const deleteTournament = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM tournaments WHERE id = ?`;
    const values = [id];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ id });
    });
  });
};

// Tournament Started
const tournamentStarted = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE tournaments SET start_date = CURRENT_TIMESTAMP WHERE id = ?`
    const values = [id];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
        }
        resolve({ id });
    });
    });
}

// Tournament Ends
const tournamentComplete = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE tournaments SET end_date = CURRENT_TIMESTAMP WHERE id = ?`
    const values = [id];
    db.run(query, values, (err) => {
      if (err) {
        return reject(err);
        }
        resolve({ id });
    });
    });
}

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  tournamentStarted,
  tournamentComplete
};
