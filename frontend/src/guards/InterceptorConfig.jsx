import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3005/api",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }else{
            config.headers.Authorization = null
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },(error) => {        
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            window.location.replace('/login');
        }
    }
)

export default axiosInstance;