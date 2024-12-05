const participationModel = require('../models/participation');
const tournamentModel = require('../models/tournament');

// Apply for a Tournament
const applyForTournament = async (req, res) => {
    try {
        const { tournament_id } = req.body;
        const user_id = req.user.id;

        // Check if tournament exists
        const tournament = await tournamentModel.getTournamentById(tournament_id);
        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }          

        // Check if user is already participating
        const existingParticipation = await participationModel.checkUserParticipation(tournament_id, user_id);
        if (existingParticipation) {
            return res.status(400).json({
                message: "You have already applied for this tournament"
            });
        }

        // Check if Tournament is full
        const participants = await participationModel.getParticipationsByTournament(tournament_id);
        if(participants.length == tournament.max_participants){
            return res.status(400).json({
                message: "Tournament is full"
            });
        }

        // Create participation
        const newParticipation = await participationModel.createParticipation({ 
            tournament_id, 
            user_id 
        });

        res.status(201).json({
            message: "Successfully applied for tournament",
            data: newParticipation
        });
    } catch (err) {
        res.status(500).json({
            message: "Error applying for tournament",
            error: err.message
        });
    }
};

// Get User's Participations
const getUserParticipations = async (req, res) => {
    try {
        const user_id = req.params.id;
        const participations = await participationModel.getUserParticipations(user_id);

        res.status(200).json({
            message: "User participations retrieved successfully",
            data: participations
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving participations",
            error: err.message
        });
    }
};

// Cancel Participation
const cancelParticipation = async (req, res) => {
    try {
        const participationId = req.params.id;
        const user_id = req.user.id;

        const participation = await participationModel.cancelParticipation(participationId, user_id);

        res.status(200).json({
            message: "Participation cancelled successfully",
            data: participation
        });
    } catch (err) {
        res.status(500).json({
            message: "Error cancelling participation",
            error: err.message
        });
    }
};

// Get Tournament's Participations
const getTournamentParticipations = async (req, res) => {
    try {
        const tournament_id = req.params.id;
        const participations = await participationModel.getParticipationsByTournament(tournament_id);        

        res.status(200).json({
            message: "Tournament participants retrieved successfully",
            data: participations
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving participants",
            error: err.message
        });
    }
};

module.exports = {
    applyForTournament,
    getUserParticipations,
    cancelParticipation,
    getTournamentParticipations
};