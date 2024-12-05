import { useEffect, useState } from "react";
import withAuth from "../guards/Authguard";
import { Link } from "react-router-dom";
import { createNewTournament } from "../services/TournamentService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateTournament = () => {  

  const navigate = useNavigate();  
  const [formData, setFormData] = useState({
    name: "",
    gameType: "",
    maxParticipants: "4",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  const handleCreateTournament = async (e) => {
    e.preventDefault();    
    try {
        const data = await createNewTournament(formData);
        toast.success('Tournament Created!');
        if(data){          
          navigate('/tournaments');
          navigate(0);
        }
      } catch (err) {
        toast.error(err.message || 'Error Creating Tournament');
      }
  };

  return (
    <div className="container">
      <h4>Create Tournament</h4>
      <form className="col-5" onSubmit={handleCreateTournament}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Game Type:</label>
          <input
            type="text"
            className="form-control"
            id="gameType"
            value={formData.gameType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Max Participants:</label>
          <select
            className="form-select"
            value={formData.maxParticipants}
            onChange={handleChange}
            id="maxParticipants"
            required
          >
            <option value="4">
              4
            </option>
            <option value="8">8</option>
            <option value="16">16</option>
          </select>
        </div>
        <button className="btn btn-primary w-25 mt-4" type="submit">
            Create
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;
