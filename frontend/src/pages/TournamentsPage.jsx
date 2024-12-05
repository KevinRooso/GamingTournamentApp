import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard"
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup, 
  faAdd
} from "@fortawesome/free-solid-svg-icons";
import { fetchTournamentList } from "../services/TournamentService";
import { Link } from "react-router-dom";
import { useAuth } from "../guards/AuthContext";

const Tournaments = () =>{

const [tournaments,setTournaments] = useState([]);

const { userData } = useAuth();

useEffect(() => {
    const fetchTournaments = async () => {
        try{
            const response = await fetchTournamentList();
            setTournaments(response.data);
        }catch(err){
            console.error("Error Fetching Tournaments", err);
        }
    }

    fetchTournaments();
}, []); // Only runs on the first load (mount) not on re rendering

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
        sortable: true
	},	
    {
		name: 'Game Type',
		selector: row => row.game_type,
        sortable: true
	},
	{
		name: 'Start Date',
		selector: row => row.start_date ? new Date(row.start_date).toLocaleDateString() : '-',
        sortable: true
	},
    {
		name: 'End Date',
		selector: row => row.end_date ? new Date(row.end_date).toLocaleDateString() : '-',
        sortable: true
	},
    {
		name: 'Max participants',
		selector: row => row.max_participants,
        sortable: true
	},
    {
        name: 'Participate',
        selector: row => {
            return (
                <Link to={`/tournaments/${row.id}/participants`}>
                <button className="btn btn-primary">
                Participants <FontAwesomeIcon icon={faUserGroup} /></button>
                </Link>                
            )
        },
    },
];

    return (
        <div className="container">
            <h4>Tournaments</h4>
            {
            userData && userData.roleId == 1 &&
            (
            <div className="d-flex justify-content-end mr-3">
                <Link to={`/tournaments/create`}>
                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faAdd} /> Create Tournament
                  </button>
                </Link>                
            </div>
            )
            }
            <div className="table-container">
            <DataTable
			columns={columns}
			data={tournaments}
            responsive
            striped                   
		    />            
            </div>
        </div>
    )
}

export default withAuth(Tournaments)