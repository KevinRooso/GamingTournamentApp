# Gaming Tournament App

## Overview

This app aims to create a platform for players to participate in competitive tournaments. Allowing them to compete in knockout matches against other players. It also offers administrators the ability to create and manage tournaments, hence guaranteeing an orderly and fair competition.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20.11.1, managed via NVM)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows) (for managing Node versions)

## Setup Instructions

### 1. Cloning the Project

Clone the repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/KevinRooso/GamingTournamentApp.git
cd GamingTournamentApp
```

### 2. Install NVM and Node Version for this Project
In the root folder of the project, open a command line window and execute:
```bash
nvm install 20.11.1
nvm use 20.11.1
```

### 3. Install Dependencies for the Project
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

### 4. Run the Node and React Applications Together
#### Backend
Navigate to the backend folder and start the Node.js server:
```bash
cd backend
node app.js
```

#### Frontend
In a separate terminal window, navigate to the frontend folder and run the React development server
```bash
cd ../frontend
npm run dev
```
