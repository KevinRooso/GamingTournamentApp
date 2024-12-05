const express = require('express');
const participationRouter = express.Router();
const participationController = require('../controllers/participationController');

// Apply for a Tournament
participationRouter.post('/tournaments/participate',     
    participationController.applyForTournament
);

// Get User's Participations
participationRouter.get('/participations/:id',    
    participationController.getUserParticipations
);

// Cancel Participation
participationRouter.delete('/participations/:id',    
    participationController.cancelParticipation
);

// Tournament Participants 
participationRouter.get('/tournaments/:id/participants',
    participationController.getTournamentParticipations
);


module.exports = participationRouter;