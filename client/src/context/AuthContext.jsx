import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('agro_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('agro_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('agro_token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('agro_user');
        localStorage.removeItem('agro_token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
