import axiosInstance from "../guards/InterceptorConfig";

// Fetch All Tournaments
export const fetchParticipantsByTournament = async (id)=>{
    try{
        const response = await axiosInstance.get(`/tournaments/${id}/participants`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Participants Failed");
    }
};

// Apply for Tournament
export const applyForTournament = async (id)=>{
    try{
        const body = {
            "tournament_id": id
        }
        const response = await axiosInstance.post(`/tournaments/participate`,body);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Applying for Tournament Failed");
    }
};

// Cancel Participation
export const cancelParticipation = async (id) => {
    try{
        const response = await axiosInstance.delete(`/participations/${id}`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.message : new Error("Cancelling Participation Failed");
    }
}