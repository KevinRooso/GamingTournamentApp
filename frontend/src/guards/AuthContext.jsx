// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userData, setUserData] = useState(null); // Initialize with null to show loading state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const user = {
                id: decoded.id,
                roleId: decoded.roleId,
            };
            setUserData(user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);
