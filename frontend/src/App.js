import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Import your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserSettingsPage from './pages/UserSettingsPage';

function App() {
  return (
    <Router>
      {/* Wrap your entire application with AuthProvider */}
      <AuthProvider>
        <div className="App">
          {/* You'll add a Navbar component here later if needed */}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes (we'll implement the PrivateRoute component soon) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<UserSettingsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;