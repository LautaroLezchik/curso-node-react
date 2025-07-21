import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isAuthenticated, logout, loading } = useAuth(); // Get user, auth status, logout function from context
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('Loading dashboard...');

  useEffect(() => {
    // If auth context is still loading, do nothing yet
    if (loading) {
      setWelcomeMessage('Loading user data...');
      return;
    }

    // If not authenticated after loading, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // If authenticated, set a welcome message
      setWelcomeMessage(`Welcome, ${user?.username || user?.email}!`);
    }
  }, [isAuthenticated, loading, navigate, user]); // Depend on isAuthenticated, loading, navigate, and user

  const handleLogout = () => {
    logout(); // Call the logout function from the AuthContext
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>{welcomeMessage}</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  // If not authenticated, the useEffect hook will redirect,
  // but as a fallback or while redirect is happening:
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h2>Access Denied</h2>
        <p>You need to be logged in to view this page. Redirecting to login...</p>
      </div>
    );
  }

  // Render the dashboard content for authenticated users
  return (
    <div style={styles.container}>
      <h2>{welcomeMessage}</h2>
      <p style={styles.subtitle}>Your personal book library awaits!</p>

      {/* Placeholder for Book List and Add Book Form */}
      <div style={styles.section}>
        <h3>Your Books</h3>
        <p>Books will be listed here soon...</p>
        {/* <BookList /> will go here */}
      </div>

      <div style={styles.section}>
        <h3>Add New Book</h3>
        <p>Add new book form will go here soon...</p>
        {/* <AddBookForm /> will go here */}
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      <Link to="/settings" style={styles.settingsLink}>Go to User Settings</Link>
    </div>
  );
};

// Basic inline styles (consider moving to CSS file for larger projects)
const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  subtitle: {
    color: '#555',
    fontSize: '1.1em',
    marginBottom: '30px',
  },
  section: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px 0',
    textAlign: 'left',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Red for logout
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '30px',
    marginRight: '15px',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#c82333',
  },
  settingsLink: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    marginTop: '30px',
    marginLeft: '15px',
    transition: 'background-color 0.3s ease',
  },
  settingsLinkHover: {
    backgroundColor: '#0056b3',
  }
};

export default DashboardPage;