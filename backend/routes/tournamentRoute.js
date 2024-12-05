const express = require('express');
const tournamentRouter = express.Router();
const tournamentController = require('../controllers/tournamentController');

// Role Authorization Middleware
const { authorize } = require('../middlewares/roleMiddleware');

// Gets all Tournaments
tournamentRouter.get('/tournaments',tournamentController.getAllTournaments);

// Gets Tournament By Id
tournamentRouter.get('/tournaments/:id',tournamentController.getTournamentDetailsById);

// Creates a new Tournament
tournamentRouter.post('/tournaments',authorize([1]),tournamentController.createTournament);

// Update a tournament
tournamentRouter.put('/tournaments/:id',authorize([1]),tournamentController.updateTournament);

// Delete a tournament
tournamentRouter.delete('/tournaments/:id',authorize([1]),tournamentController.deleteTournament);

module.exports = tournamentRouter;