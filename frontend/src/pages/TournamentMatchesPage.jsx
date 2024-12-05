import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard"
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faBan, 
  faPlay,
  faForward
} from "@fortawesome/free-solid-svg-icons";
import { advanceToNextRound, fetchTournamentDetailsById } from "../services/TournamentService";
import { fetchMatchesListByTournament, simulateRoundForTournament } from "../services/MatchService";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuth } from "../guards/AuthContext";

const TournamentMatches = () =>{

const params = useParams(); 
const tournamentId = params.id;
const { userData } = useAuth();

const [tournamentData, setTournamentData]  = useState('')
const [matches, setMatches] = useState([]);
const [maxRound, setMaxRound] = useState();
const [advanceNextRound, setAdvanceNextRound] = useState();

useEffect(() => {        
    fetchMatches()
    fetchTournamentData()
}, []); // Only runs on the first load (mount) not on re rendering

const fetchMatches = async () => {
    try{
        const response = await fetchMatchesListByTournament(tournamentId);
        setMatches(response.data);
        if(response.data.length > 0){
            // Sets the Maximum Round in the array
            let mround = response.data.reduce((max, match) => {
                return match.round > max ? match.round : max;
            }, response.data[0].round);
            setMaxRound(mround);

            // If maximum round has all winners , it will toggle the advance round flag
            let advanceFlag = response.data.filter((i) => i.round == mround).every((j) => j.winner_id != null);
            setAdvanceNextRound(advanceFlag);
        }            
    }catch(err){
        console.error("Error Fetching Participants", err);
    }
}

const fetchTournamentData = async () => {
    try{
        const response = await fetchTournamentDetailsById(tournamentId);
        setTournamentData(response.data);            
    }catch(err){
        console.error("Error Fetching Details", err);
    }
}

const simulateRound = async () =>{
    try{
        const response = await simulateRoundForTournament(tournamentId,maxRound);
        toast.success("Round simulated successfully");
        fetchMatches();
    }catch(err){
        console.error("Error Fetching Details", err);
    }
}

const advanceRound = async () =>{
    try{
        const response = await advanceToNextRound(tournamentId,maxRound);
        if(response.data){
            toast.success("Advanced to Next Round successfully");
        }else if(response.message){
            toast.success(response.message);
        }
        fetchMatches();
    }catch(err){
        console.error("Error Fetching Details", err);
    }
}

const columns = [    
    {
        name: 'Round',
        selector: row => row.round,
    },
    {
        name: 'Player 1 Name',
        selector: row => row.player1_name,
    },
    {
        name: 'Player 2 Name',
        selector: row => row.player2_name,
    },
    {
        name: 'Match Date',
        selector: row => new Date(row.match_date).toLocaleDateString(),
    },
    {
        name: 'Player 1 Score',
        selector: row => row.score_player1,
    },
    {
        name: 'Player 2 Score',
        selector: row => row.score_player2,
    },
    {
        name: 'Winner',
        selector: row => row.winner_name,
    },
    {
        name: 'Created Date',
        selector: row => new Date(row.created_at).toLocaleDateString(),
    }
];

    return (
        <div className="container">            
            <h4>{tournamentData && tournamentData.name} Matches</h4> 
            {
              matches && matches.length > 0 && !advanceNextRound &&
              userData && userData.roleId == 1 && (
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={simulateRound}>
                    Simulate <FontAwesomeIcon icon={faForward} />
               </button>
              </div>
                )
            }  
            {
              matches && matches.length > 0 && advanceNextRound && 
              userData && userData.roleId == 1 && (
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={advanceRound}>
                    Advance <FontAwesomeIcon icon={faForward} />
               </button>
              </div>
                )
            }    
            <div className="table-container">
            <DataTable
			columns={columns}
			data={matches}
            responsive            
            striped                   
		    />                            
            </div>             
        </div>
    )
}

export default withAuth(TournamentMatches)