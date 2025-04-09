import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard"
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup, 
  faAdd,
  faEdit
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

let columns = [
	{
		name: 'Name',
		selector: row => row.name,
        sortable: true
	},	
    {
		name: 'Game Type',
		selector: row => row.gameType,
        sortable: true
	},
	{
		name: 'Start Date',
		selector: row => row.startDate ? new Date(row.startDate).toLocaleDateString() : '-',
        sortable: true
	},
    {
		name: 'End Date',
		selector: row => row.endDate ? new Date(row.endDate).toLocaleDateString() : '-',
        sortable: true
	},
    {
		name: 'Max participants',
		selector: row => row.maxParticipants,
        sortable: true
	},
    {
        name: 'Participants',
        selector: row => {
            return (
                <Link to={`/tournaments/${row.id}/participants`}>
                <button className="btn btn-primary px-3">
                <FontAwesomeIcon icon={faUserGroup} /></button>
                </Link>                
            )
        },
    }
];

if(userData && userData.roleId == 1){
    columns.push(
        {
        name: 'Actions',
        selector: row => {            
            return (
                <div>
                    <Link to={`/tournaments/${row.id}/update`}>
                    <button className={`btn btn-primary px-3 ${row.start_date ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                    </button>
                    </Link>
                </div>
                )
        }}
    );
}

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