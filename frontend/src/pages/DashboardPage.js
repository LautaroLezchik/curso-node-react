import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// CORRECTED PATHS for components
import BookList from '../components/BookList';     
import AddBookForm from '../components/AddBookForm'; 

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api/books/';

const DashboardPage = () => {
  const { user, isAuthenticated, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [dashboardMessage, setDashboardMessage] = useState('Loading dashboard...');
  const [error, setError] = useState('');

  const fetchBooks = useCallback(async () => {
    if (!token) return;

    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
      setBooks(response.data);
    } catch (err) {
      console.error('Failed to fetch books:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to load books. Please try again.');
      if (err.response?.status === 401) {
        logout();
      }
    }
  }, [token, logout]);

  useEffect(() => {
    if (loading) {
      setDashboardMessage('Loading user data...');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setDashboardMessage(`Welcome, ${user?.username || user?.email}!`);
      fetchBooks();
    }
  }, [isAuthenticated, loading, navigate, user, fetchBooks]);

  const handleDeleteBook = async (bookId) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`${API_URL}${bookId}`, config);
        setBooks(books.filter((book) => book._id !== bookId));
      } catch (err) {
        console.error('Failed to delete book:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to delete book.');
        if (err.response?.status === 401) {
          logout();
        }
      }
    }
  };

  const handleToggleRead = async (bookId, currentReadStatus) => {
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.put(`${API_URL}${bookId}`, { read: currentReadStatus }, config);
      setBooks(books.map((book) => (book._id === bookId ? response.data : book)));
    } catch (err) {
      console.error('Failed to update book status:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to update book status.');
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };

  // Ensure handleLogout is explicitly defined within the component scope
  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>{dashboardMessage}</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h2>Access Denied</h2>
        <p>You need to be logged in to view this page. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>{dashboardMessage}</h2>
      <p style={styles.subtitle}>Your personal book library awaits!</p>

      {error && <p style={styles.errorMessage}>{error}</p>}

      <div style={styles.section}>
        <h3>Add New Book</h3>
        <AddBookForm onBookAdded={handleBookAdded} />
      </div>

      <div style={styles.section}>
        <h3>Your Books</h3>
        <BookList
          books={books}
          onDeleteBook={handleDeleteBook}
          onToggleRead={handleToggleRead}
        />
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

// ... (styles object remains the same)

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
    backgroundColor: '#dc3545',
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
  errorMessage: {
    color: 'red',
    backgroundColor: '#ffe0e0',
    border: '1px solid #ff0000',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};

export default DashboardPage;