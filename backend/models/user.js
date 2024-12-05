const db = require("../config/dbConfig");
const bcrypt = require("bcryptjs");

// User TABLE CREATION
db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,            
            password TEXT NOT NULL,
            roleId INTEGER NOT NULL,
            roleName TEXT NOT NULL,
            contact TEXT NOT NULL
        )
    `,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table is ready!");
      }
    }
  );
});

// Create a user
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { name,username, email, password, contact } = userData;
    //  Hashes the password and within
    // same callback function it runs the db query to use the hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      // If failure to hash it gives error
      if (err) {
        return reject(err);
      }
      // Inserts the new user record in table
      const query =
        "INSERT INTO users(name,username,email,password,roleId,roleName,contact) VALUES (?,?,?,?,?,?,?)";
      const values = [
        name,
        username,
        email,
        hashedPassword,
        2,
        "User",
        contact
      ];
      db.run(query, values, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  });
};

// Get user by username
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * from users where username = ?";
    const values = [username];
    db.get(query, values, (err, row) => {
      if (err) {
        return reject(err);
      }
      if (row) {
        resolve(row);
      } else {
        resolve(null); // Returns null if no user found
      }
    });
  });
};

// Function to compare a plain password with the hashed password
const comparePassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

// Function get all Users
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * from users where roleId=2";
    db.all(query, (err, rows) => {
      if (err) {
        return reject(err);
      }

      // Excludes the password from result
      const userWithoutPassword = rows.map((row) => {
        const { password, ...userWithoutPassword } = row;
        return userWithoutPassword;
      });
      resolve(userWithoutPassword);
    });
  });
};

// Get User Model by Id (After Authentication)
const getUserDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * from users where id = ?";
    const values = [id];
    db.get(query, values, (err, row) => {
      if (err) {
        return reject(err);
      }
      if (row) {
        const { password, ...userWithoutPassword } = row;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    });
  });
};

module.exports = {
    createUser,
    getUserByUsername,
    comparePassword,
    getAllUsers,
    getUserDetailsById
};
