const tournamentModel = require('../models/tournament');

// Get All Tournaments
const getAllTournaments = async(req,res) => {
    try {
        const tournaments = await tournamentModel.findAll();
        res.status(200).json({
            message: "Tournaments retrieved successfully",
            data: tournaments
        });
    }catch(err){
        res.status(500).json({
            message: "Error retrieving tournaments",
            error: err.message
        });
    }
}

// Get Tournament Details By Id
const getTournamentDetailsById = async(req,res) => {
    try {
        const tournamentId = req.params.id;
        const tournament = await tournamentModel.findByPk(tournamentId);
        if(!tournament){
            return res.status(404).json({
                message: "Tournament not found",                
            });
        }
        res.status(200).json({
            message: "Tournament details retrieved successfully",
            data: tournament
        });
    }catch(err){
        res.status(500).json({
            message: "Error retrieving tournament details",
            error: err.message
        });
    }
}

// Create a new Tournament
const createTournament = async(req,res) => {
    try {
        const tournamentData = req.body;
        const newTournament = await tournamentModel.create(tournamentData);
        res.status(201).json({
            message: "Tournament created successfully",
            data: newTournament
        });
    }catch(err){
        res.status(500).json({
            message: "Error creating tournament",
            error: err.message
        });
    }
}

// Update a Tournament
const updateTournament = async(req,res) => {
    try{
        const tournamentId = req.params.id;
        const tournamentData = req.body;

        // Use Sequelize's findByPk method to check if the tournament exists
        const tournament = await tournamentModel.findByPk(tournamentId);
        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }
        
        // Update the tournament
        await tournament.update(tournamentData);
        res.status(200).json({
            message: "Tournament updated successfully",
            data: tournament
        });
    }catch(err){
        res.status(500).json({
            message: "Error updating tournament",
            error: err.message
        });
    }
}

// Delete a Tournament
const deleteTournament = async(req,res) => {
    try{
        const tournamentId = req.params.id;
         // Use Sequelize's findByPk to check if the tournament exists
         const tournament = await tournamentModel.findByPk(tournamentId);
         if (!tournament) {
             return res.status(404).json({
                 message: "Tournament not found"
             });
         }

        await tournament.destroy();
        res.status(200).json({
            message: "Tournament deleted successfully"
        });
    }catch(err){
        res.status(500).json({
            message: "Error deleting tournament",
            error: err.message
        });
    }
}

module.exports = {
    createTournament,
    updateTournament,
    deleteTournament,
    getAllTournaments,
    getTournamentDetailsById
}