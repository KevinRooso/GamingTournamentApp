const express = require('express');
const matchRouter = express.Router();
const matchController = require('../controllers/matchController');
const { authorize } = require('../middlewares/roleMiddleware');

// Get all matches
matchRouter.get('/matches', matchController.getAllMatches);

// Get match by ID
matchRouter.get('/matches/:id', matchController.getMatchDetailsById);

// Create a new match
matchRouter.post('/matches', matchController.createMatch);

// Update a match
matchRouter.put('/matches/:id', matchController.updateMatch);

// Delete a match
matchRouter.delete('/matches/:id', matchController.deleteMatch);

// Create Knockout matches
matchRouter.get('/tournament/:id/start', matchController.createKnockoutMatches);

// Advance to next round of tournament
matchRouter.get('/tournament/:id/advance',authorize([1]), matchController.createSubsequentRoundMatches);

// Get Matches By Tournament Id
matchRouter.get('/tournament/:id/matches', matchController.getMatchesByTournamentId);

// Simulate Matches By Tournament Id and Round Id
matchRouter.get('/tournament/:id/:round/simulate',authorize([1]), matchController.simulateRoundMatches);

// Get Matches By User Id
matchRouter.get('/user/:id/matches', matchController.getMatchesByUserId);

module.exports = matchRouter;