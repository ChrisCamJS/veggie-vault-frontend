import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, premiumOnly = false }) => {
    const { user } = useAuth();

    // Boot them if no user is found at all
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // They are logged in, but are they on the admin guest list?
    if (adminOnly && user.is_admin !== 1) {
        return <Navigate to="/" replace />;
    }

    // We check the new account_tier from the database payload.
    if (premiumOnly && user.account_tier !== 'premium') {
        // Redirecting to home for now. 
        // Note: We should probably build an eye-catching '/upgrade' page later to take their money!
        return <Navigate to="/" replace />;
    }

    // If they pass all the checks, unclip the velvet rope and render the child routes!
    return <Outlet />;
}

export default ProtectedRoute;