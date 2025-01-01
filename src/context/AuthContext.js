import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = "https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net";

    // Function to decode JWT token and extract user ID
    const decodeToken = (token) => {
        const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
        return decoded ? decoded.userId : null;
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            console.log(response.data);
            const { token } = response.data;
            const userId = decodeToken(token); // Extract userId from token

            // Save token and userId to localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);

            // Update user state with userId and token
            setUser({ token, userId });
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, customerSignup, adminSignup }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
