const matchModel = require('../models/match');
const tournamentModel = require('../models/tournament');
const participantModel = require('../models/participation');

// Get all matches
const getAllMatches = async (req, res) => {
    try {
        const matches = await matchModel.getAllMatches();
        res.status(200).json({
            message: "Matches retrieved successfully",
            data: matches
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving matches',
            error: err.message
        });
    }
};

// Get match details by ID
const getMatchDetailsById = async (req, res) => {
    try {
        const id = req.params.id;
        const match = await matchModel.getMatchById(id);

        if (!match) {
            return res.status(404).json({
                message: 'Match does not exist'
            });
        }

        res.status(200).json(match);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving match',
            error: err.message
        });
    }
};

// Get Matches By Tournament Id
const getMatchesByTournamentId = async (req, res) => {
    try {        
        const tournamentId = req.params.id;        
        const matches = await matchModel.getMatchesByTournamentId(tournamentId);
        if(!matches){
            return res.status(404).json({
                message: 'No matches found for this tournament'
            });
        }
        res.status(200).json({
            message: "Matches retrieved successfully",
            data: matches
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving matches',
            error: err.message
        });
    }
}; 

// Create a new match
const createMatch = async (req, res) => {
    try {
        const matchData = req.body;
        const newMatch = await matchModel.createMatch(matchData);
        res.status(201).json({
            message: "Match created successfully",
            match: newMatch
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error creating match',
            error: err.message
        });
    }
};

// Update a match
const updateMatch = async (req, res) => {
    try {
        const id = req.params.id;
        const matchData = req.body;
        const updatedMatch = await matchModel.updateMatch(id, matchData);
        res.status(200).json({
            message: "Match updated successfully",
            match: updatedMatch
        });
    } catch (err) {
        res.status(500).json({
            message : 'Error updating match',
            error: err.message
        });
    }
};

// Delete a match
const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id;
        await matchModel.deleteMatch(id);
        res.status(200).json({
            message: "Match deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting match',
            error: err.message
        });
    }
};

// Create Knockout Matches

const createKnockoutMatches =  async (req,res) => {
    try{
        const tournamentId = req.params.id;
        
        // Get Particpants for Tournament
        const participants = await participantModel.getParticipationsByTournament(tournamentId);

        // Check if number of participants is power of 2 (2,4,8..)
        if (participants.length !== Math.pow(2, Math.floor(Math.log2(participants.length)))){
            return res.status(400).json({
                message: "Number of participants must be a power of 2"
            });
        }

        // Update the tournament start data
        const updatedTournament = await tournamentModel.tournamentStarted(tournamentId);        
        
        // Shuffle Participants for Random pairings
        console.log(participants);
        const shuffledParticipants = shuffleArray(participants);

        // Create matches for first round
        const round = 1;
        const matches = [];
        for(let i = 0; i < shuffledParticipants.length; i+=2){
            const participant1 = shuffledParticipants[i].user_id;
            const participant2 = shuffledParticipants[i+1].user_id;

            // Create a match
            const match = await matchModel.createMatch({
                tournament_id: tournamentId,
                player1_id: participant1,
                player2_id: participant2,
                winner_id: null,
                score_player1: null,
                score_player2: null,
                match_date: new Date(),
                round: round
            });

            matches.push(match);
        }
        if(matches.length > 0){
            return res.status(200).json({
                message: "Tournament started successfully",
            });
        }
    }catch(err){
        res.status(500).json({
            message: 'Error creating knockout matches',
            error: err.message
        });
    }
}

const createSubsequentRoundMatches = async (req,res) => {
    try{
        const tournamentId = req.params.id;

        // Get Max Round for the tournament
        const maxRound = await matchModel.getMaxRoundForTournament(tournamentId);

        // Check if only one winner left 
        const winners = await matchModel.getWinnersOfRound(tournamentId,maxRound);
        if(winners.length === 1){
            return res.status(200).json({
                message: "Tournament is complete"
            });
        }

        // Ensure past rounds have winner before creating new round
        const round_matches = await matchModel.getMatchesByTournamentAndRound(tournamentId, maxRound);
        if(round_matches.length !== winners.length){
            return res.status(400).json({
                message: "Past rounds must have a winner before creating new round"
            });
        }

        const shuffledWinners = shuffleArray(winners);        

        // Create matches for next round
        const nextRound = maxRound + 1;
        const newMatches = [];
        for(let i = 0; i < shuffledWinners.length; i+=2){
            // Create a match
            const match = await matchModel.createMatch({
                tournament_id: tournamentId,
                player1_id: shuffledWinners[i],
                player2_id: shuffledWinners[i+1],
                winner_id: null,
                score_player1: null,
                score_player2: null,
                match_date: new Date(),
                round: nextRound
            });

            newMatches.push(match);
        }

        res.status(200).json({
            message: `Round ${nextRound} matches created successfully.`,
            matches: newMatches
        });

    }catch(err){
        res.status(500).json({
            message: 'Error creating subsequent round matches',
            error: err.message
        });
    }
}

const simulateRoundMatches = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const round = req.params.round; // The round to simulate matches for

        // Get all matches for the specified round in the tournament
        const matches = await matchModel.getMatchesByTournamentAndRound(tournamentId, round);
        
        if (matches.length === 0) {
            return res.status(404).json({
                message: `No matches found for round ${round} in this tournament`
            });
        }

        if(matches.length == 1){                
            await tournamentModel.tournamentComplete(tournamentId);
        }

        const simulatedMatches = [];

        for (let match of matches) {
            // Simulate random scores for player1 and player2
            const scorePlayer1 = Math.random() < 0.5 ? 10 : Math.floor(Math.random() * 10); // Player 1 gets 10 or a random score between 0-9
            const scorePlayer2 = scorePlayer1 === 10 ? Math.floor(Math.random() * 10) : 10; // Player 2 gets 10 if Player 1 has random score, else random
            // Determine the winner based on scores
            const winnerId = scorePlayer1 > scorePlayer2 ? match.player1_id : (scorePlayer1 < scorePlayer2 ? match.player2_id : null);

            // Update the match with the simulated scores and winner
            const updatedMatch = await matchModel.updateSimulateMatch(match.id, {
                score_player1: scorePlayer1,
                score_player2: scorePlayer2,
                winner_id: winnerId,
                updated_at: new Date()
            });

            simulatedMatches.push(updatedMatch);
        }

        res.status(200).json({
            message: `Matches for round ${round} simulated successfully`,
            data: simulatedMatches
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error simulating round matches',
            error: err.message
        });
    }
};

// Get match details by ID
const getMatchesByUserId = async (req, res) => {
    try {        
        const id = req.params.id;        
        const matches = await matchModel.getMatchesByUserId(id);
        if(!matches){
            return res.status(404).json({
                message: 'No matches found for this user'
            });
        }
        res.status(200).json({
            message: "Matches retrieved successfully",
            data: matches
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving matches',
            error: err.message
        });
    }
};


// Helper function to shuffle the array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generates a random number between 0 and i
      [array[i], array[j]] = [array[j], array[i]]; // Swapping in one line
    }
    return array;
};


module.exports = {
    getAllMatches,
    getMatchDetailsById,
    getMatchesByTournamentId,
    createMatch,
    updateMatch,
    deleteMatch,
    createKnockoutMatches,
    createSubsequentRoundMatches,
    simulateRoundMatches,
    getMatchesByUserId
};