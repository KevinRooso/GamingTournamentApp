import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard";
import DataTable from "react-data-table-component";
import axios from "axios";
import { fetchMatchList, getMatchesByUserId } from "../services/MatchService";
import { useAuth } from "../guards/AuthContext";

const Matches = () => {
  const { userData } = useAuth();

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetchMatchList();
        setMatches(response.data);
      } catch (err) {
        console.error("Error Fetching Matches", err);
      }
    };

    const fetchMyMatches = async () => {
      try {
        const response = await getMatchesByUserId(userData.id);
        setMatches(response.data);
      } catch (err) {
        console.error("Error Fetching Matches", err);
      }
    };

    if (userData && userData.roleId == 1) {
      fetchMatches();
    } else {
      fetchMyMatches();
    }
  }, [userData]); // Only runs on the first load (mount) not on re rendering

  const columns = [
    {
      name: "Tournament Name",
      selector: (row) => row.tournament_name,
      sortable:true
    },
    {
      name: "Player 1 Name",
      selector: (row) => row.player1_name,
      sortable:true
    },
    {
      name: "Player 1 Name",
      selector: (row) => row.player2_name,
      sortable:true
    },
    {
      name: "Match Date",
      selector: (row) =>
        row.match_date ? new Date(row.match_date).toLocaleDateString() : "-",
      sortable:true
    },
    {
      name: "Winner",
      selector: (row) => row.winner_name,
      sortable:true
    },
    {
      name: "Created Date",
      selector: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
      sortable:true
    },
  ];

  const customStyles = {
    table: {
      maxHeight: "400px", // Set your desired max height
      overflowY: "auto", // Enable vertical scrolling if content overflows
    },
  };

  return (
    <div className="container">
      <h4>Matches</h4>
      <div className="table-container">
        <DataTable
          columns={columns}
          data={matches}
          responsive          
          striped
          fixedHeader
          pagination
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default withAuth(Matches);
