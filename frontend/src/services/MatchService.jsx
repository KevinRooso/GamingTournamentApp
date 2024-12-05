import axiosInstance from "../guards/InterceptorConfig";

// Fetch All Matches
export const fetchMatchList = async ()=>{
    try{
        const response = await axiosInstance.get('/matches');
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Matches Failed");
    }
};

// Fetch All Matches By Tournament
export const fetchMatchesListByTournament = async (id)=>{
    try{
        const response = await axiosInstance.get(`/tournament/${id}/matches`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Matches Failed");
    }
};

// Create Match
export const createNewMatch = async (formData)=>{
    try{        
        const response = await axiosInstance.post(`/matches`,formData);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Creating Match Failed");
    }
};

// Simulate Matches For Round
export const simulateRoundForTournament = async (id,round)=>{
    try{
        const response = await axiosInstance.get(`/tournament/${id}/${round}/simulate`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Matches Failed");
    }
};

export const getMatchesByUserId = async (id) => {    
    try{
        const response = await axiosInstance.get(`/user/${id}/matches`);
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Matches Failed");
    }
}