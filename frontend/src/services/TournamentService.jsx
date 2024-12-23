import axiosInstance from "../guards/InterceptorConfig";

// Fetch All Tournaments
export const fetchTournamentList = async ()=>{
    try{
        const response = await axiosInstance.get('/tournaments');
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Tournaments Failed");
    }
};

// Fetch Tournament By Id
export const fetchTournamentDetailsById = async (id)=>{
    try{
        const response = await axiosInstance.get(`/tournaments/${id}`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Tournament Failed");
    }
};

// Create Tournament
export const createNewTournament = async (formData)=>{
    try{        
        const response = await axiosInstance.post(`/tournaments`,formData);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Creating Tournament Failed");
    }
};

// Update Tournament
export const updateTournament = async (formData,id)=>{
    try{        
        const response = await axiosInstance.put(`/tournaments/${id}`,formData);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Updating Tournament Failed");
    }
};


// Start Tournament
export const startKnockoutTournament = async (id)=>{
    try{        
        const response = await axiosInstance.get(`/tournament/${id}/start`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Starting Tournament Failed");
    }
};

// Advance to Next Round
export const advanceToNextRound = async (id)=>{
    try{        
        const response = await axiosInstance.get(`/tournament/${id}/advance`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Advancing Round Failed");
    }
};