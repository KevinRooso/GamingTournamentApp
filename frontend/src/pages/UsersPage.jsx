import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard"
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup, 
  faAdd
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../guards/AuthContext";
import { fetchUserList } from "../services/UserService";

const Users = () =>{

const [users,setUsers] = useState([]);

const { userData } = useAuth();

useEffect(() => {
    const fetchUsers = async () => {
        try{
            const response = await fetchUserList();
            setUsers(response.data);
        }catch(err){
            console.error("Error Fetching Users", err);
        }
    }

    fetchUsers();
}, []); // Only runs on the first load (mount) not on re rendering

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
		name: 'Email',
		selector: row => row.email,
        sortable: true
	},
    {
		name: 'Contact',
		selector: row => row.contact,
        sortable: true
	},
];

    return (
        <div className="container">
            <h4>Users</h4>            
            <div className="table-container">
            <DataTable
			columns={columns}
			data={users}
            responsive
            striped                   
		    />            
            </div>
        </div>
    )
}

export default withAuth(Users)