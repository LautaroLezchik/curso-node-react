import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// Base URL for your backend API
// IMPORTANT: Make sure this matches your backend's running port
const API_URL = 'http://localhost:5000/api/auth/';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // To check if initial load is complete
    const navigate = useNavigate(); // For programmatic navigation

    // Check for token in localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // Also store user info
        if (storedToken && storedUser) {
            // You might want to verify the token's validity with a backend call here
            // For simplicity, we'll assume it's valid if present
            setToken(storedToken);
            setUser(JSON.parse(storedUser)); // Parse user object from string
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post(API_URL + 'login', { email, password });
            const { token, _id, username, email: userEmail } = response.data;

            localStorage.setItem('token', token);
            // Store essential user info, stringify it
            localStorage.setItem('user', JSON.stringify({ _id, username, email: userEmail }));

            setToken(token);
            setUser({ _id, username, email: userEmail });
            navigate('/dashboard'); // Redirect to dashboard on successful login
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please check your credentials.',
            };
        }
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            const response = await axios.post(API_URL + 'register', { username, email, password });
            const { token, _id, username: newUsername, email: newUserEmail } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ _id, username: newUsername, email: newUserEmail }));

            setToken(token);
            setUser({ _id, username: newUsername, email: newUserEmail });
            navigate('/dashboard'); // Redirect to dashboard on successful registration
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. User may already exist or invalid data.',
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login'); // Redirect to login page on logout
    };

    const isAuthenticated = !!token && !!user; // Boolean to easily check authentication status

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
            {!loading && children} {/* Only render children once initial loading is done */}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the AuthContext in components
export const useAuth = () => {
    return useContext(AuthContext);
};