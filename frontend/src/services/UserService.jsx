import axiosInstance from "../guards/InterceptorConfig";

// Fetch All Tournaments
export const fetchUserList = async ()=>{
    try{
        const response = await axiosInstance.get('/users');
        return response.data;
    }catch(error){        
        throw error.response ? error.response.data : new Error("Fetching Users Failed");
    }
};
