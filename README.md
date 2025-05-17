# Gaming Tournament App

## Overview

The Gaming Tournament App is a platform designed for players to participate in competitive tournaments. It allows players to compete in knockout matches and provides administrators with tools to create and manage tournaments, ensuring a fair and organized competition.

## Features

- **User Authentication**: Secure login and registration system.
- **Tournament Management**: Create, update, and delete tournaments.
- **Participant Management**: Apply for tournaments, cancel participation, and view participants.
- **Match Simulation**: Simulate matches and advance rounds in knockout tournaments.
- **Dashboard**: Visualize player statistics and match data using interactive charts.
- **Role-Based Access**: Separate functionalities for administrators and regular users.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20.11.1, managed via NVM)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows) (for managing Node versions)

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/KevinRooso/GamingTournamentApp.git
cd GamingTournamentApp
```

### 2. Install Node.js Using NVM

In the root folder of the project, open a command line window and execute:

```bash
nvm install 20.11.1
nvm use 20.11.1
```

### 3. Install Dependencies

Install the required dependencies for both the backend and frontend.

#### Backend
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

#### Frontend
Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

### 4. Run the Application

#### Backend
Start the Node.js server:

```bash
cd backend
node app.js
```

#### Frontend
In a separate terminal window, start the React development server:

```bash
cd frontend
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Project Structure

```
GamingTournamentApp/
├── backend/                # Backend code
│   ├── app.js             # Main server file
│   ├── config/            # Database configuration
│   ├── controllers/       # API controllers
│   ├── middlewares/       # Authentication and role-based access
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── data/              # SQLite database file
├── frontend/               # Frontend code
│   ├── src/               # React source files
│   │   ├── components/    # Reusable components
│   │   ├── guards/        # Authentication guards
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service files
│   │   └── styles/        # CSS styles
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
└── README.md               # Project documentation
```

## Technologies Used

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite

### Frontend
- React.js
- Vite
- Bootstrap
- ApexCharts
- React Data Table Component

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
JWT_SECRET=YourSecretKey
DB_PATH=./data/mydatabase.db
```

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.
