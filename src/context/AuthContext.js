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

    const customerSignup = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/customer/register/`, { name, email, password });
            return response.data; // Success message or additional data
        } catch (error) {
            console.error('Signup failed:', error);
            throw error.response?.data?.message || 'Signup failed. Try again.';
        }
    }
    
    const adminSignup = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/admin/register/`, { name, email, password });
            return response.data; // Success message or additional data
        } catch (error) {
            console.error('Signup failed:', error);
            throw error.response?.data?.message || 'Signup failed. Try again.';
        }
    }

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
