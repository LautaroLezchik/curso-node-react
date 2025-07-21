import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To get the token
import { useNavigate } from 'react-router-dom'; // For potential redirection on auth error

const API_URL = 'http://localhost:5000/api/books/'; // Base URL for your book API

const AddBookForm = ({ onBookAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [read, setRead] = useState(false); // Default to unread
  const [message, setMessage] = useState(''); // For success/error messages
  const [loading, setLoading] = useState(false); // For showing loading state

  const { token, logout } = useAuth(); // Get token and logout from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setLoading(true);

    // Basic client-side validation
    if (!title.trim() || !author.trim()) {
      setMessage('Title and Author are required!');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT for authentication
          'Content-Type': 'application/json', // Specify content type for JSON body
        },
      };

      const response = await axios.post(API_URL, { title, author, read }, config);

      setMessage('Book added successfully!');
      setTitle(''); // Clear form fields
      setAuthor('');
      setRead(false);

      // Call the callback function passed from DashboardPage
      // This will update the book list in the parent component
      if (onBookAdded) {
        onBookAdded(response.data);
      }
    } catch (error) {
      console.error('Error adding book:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Failed to add book. Please try again.');
      // If server responds with 401, token might be invalid/expired, so log out
      if (error.response?.status === 401) {
        logout();
        navigate('/login'); // Redirect to login
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., The Lord of the Rings"
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="author" style={styles.label}>Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={styles.input}
            placeholder="e.g., J.R.R. Tolkien"
            disabled={loading}
          />
        </div>

        <div style={styles.formGroupCheck}>
          <input
            type="checkbox"
            id="read"
            checked={read}
            onChange={(e) => setRead(e.target.checked)}
            style={styles.checkbox}
            disabled={loading}
          />
          <label htmlFor="read" style={styles.checkboxLabel}>Mark as Read</label>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
      {message && (
        <p style={{ ...styles.message, color: message.includes('successfully') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    textAlign: 'left',
  },
  formGroupCheck: {
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1em',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  checkboxLabel: {
    fontWeight: 'normal',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#a0c9eb',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#e9e9e9',
    fontSize: '0.9em',
  },
};

export default AddBookForm;