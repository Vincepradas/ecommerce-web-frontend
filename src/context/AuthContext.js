import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = "https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net";

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            const { token } = response.data; 
            localStorage.setItem('authToken', token);
            setUser({ token });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
