import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard"
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faBan, 
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { applyForTournament, cancelParticipation, fetchParticipantsByTournament } from "../services/ParticipantService";
import { fetchTournamentDetailsById,startKnockoutTournament } from "../services/TournamentService";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuth } from "../guards/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Participants = () =>{

const params = useParams(); 
const tournamentId = params.id;
const { userData } = useAuth();
const navigate = useNavigate();

const [tournamentData, setTournamentData]  = useState('')
const [participants, setParticipants] = useState([]);

useEffect(() => {        
    fetchParticipants()
    fetchTournamentData()
}, []); // Only runs on the first load (mount) not on re rendering

const fetchParticipants = async () => {
    try{
        const response = await fetchParticipantsByTournament(tournamentId);
        setParticipants(response.data);            
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

const participateTournament = async () => {
    try{
        const response = await applyForTournament(tournamentId);
        if(response.data){
            toast.success('Applied for the Tournament!');
        }else if(response.message){
            toast.success(response.message);
        }
        fetchParticipants();      
    }catch(error){
        toast.error(error.message || "Error Occurred");
    }
}

const cancelParticipationTournament = async (id) => {
    try{
        const response = await cancelParticipation(id);
        toast.success('Participation Cancelled!');
        fetchParticipants();      
    }catch(error){
        toast.error(error.message || "Error Occurred");
    }
}

const startTournament = async (id) => {
    try{
        const response = await startKnockoutTournament(id);        
        toast.success('Tournament Started!');
        navigate(`/tournaments/${id}/matches`);
        navigate(0);
         
    }catch(error){
        toast.error(error.message || "Error Occurred");
    }
}

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
        sortable: true
	},	
    {
		name: 'Username',
		selector: row => row.username,
        sortable: true
	},
	{
		name: 'Applied at',
		selector: row => new Date(row.created_at).toLocaleDateString(),
        sortable: true
	},    
    {
		name: 'Status',
		selector: row => row.status,
        sortable: true
	},
    {
        name: 'Actions',
        selector: row => {
            return ( 
                userData.id == row.user_id && !tournamentData.start_date ? 
                (<button className="btn btn-danger" onClick={() => {cancelParticipationTournament(row.id)}}>
                Cancel <FontAwesomeIcon icon={faBan} /></button>)               
                : (<span>-</span>)
            )
        },
    },
];

    return (
        <div className="container">            
            <h4>{tournamentData && tournamentData.name} Participants</h4>
            {
            (userData && userData.roleId == 2) && (participants.length < tournamentData.max_participants) && (
            <div className="d-flex justify-content-end mr-3">
                <button className="btn btn-primary" onClick={participateTournament}>
                    Participate <FontAwesomeIcon icon={faHand} />
                </button>
            </div>
            )
            }
            {
                (userData && userData.roleId == 1) && (participants.length == tournamentData.max_participants)
                && (!tournamentData.start_date)
                &&
                (
                <div className="d-flex justify-content-end mr-3">
                    <button className="btn btn-primary" onClick={() => {startTournament(tournamentData.id)}}>
                        <FontAwesomeIcon icon={faPlay}  /> Start
                    </button>
                </div>   
                )
            }
            {
                (tournamentData.start_date) && (participants.length == tournamentData.max_participants)
                && 
                (
                    <div className="d-flex justify-content-end mr-3">
                        <Link to={`/tournaments/${tournamentData.id}/matches`}>
                        <button className="btn btn-primary">
                            Matches
                        </button>
                        </Link>                        
                    </div>
                )
            }
            <div className="table-container">
            <DataTable
			columns={columns}
			data={participants}
            responsive            
            striped                   
		    />            
            </div>
        </div>
    )
}

export default withAuth(Participants)