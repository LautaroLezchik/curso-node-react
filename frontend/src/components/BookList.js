import React from 'react';

const BookList = ({ books, onDeleteBook, onToggleRead }) => {
  if (!books || books.length === 0) {
    return <p style={styles.noBooksMessage}>No books found. Add some to get started!</p>;
  }

  return (
    <div style={styles.listContainer}>
      {books.map((book) => (
        <div key={book._id} style={styles.bookItem}>
          <div style={styles.bookInfo}>
            <h4 style={styles.bookTitle}>{book.title}</h4>
            <p style={styles.bookAuthor}>by {book.author}</p>
            <p style={styles.bookStatus}>Status: {book.read ? 'Read' : 'Unread'}</p>
            <p style={styles.bookDate}>Added on: {new Date(book.createdAt).toLocaleDateString()}</p>
          </div>
          <div style={styles.bookActions}>
            <button
              onClick={() => onToggleRead(book._id, !book.read)}
              style={book.read ? styles.markUnreadButton : styles.markReadButton}
            >
              Mark as {book.read ? 'Unread' : 'Read'}
            </button>
            <button
              onClick={() => onDeleteBook(book._id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  bookItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  bookInfo: {
    textAlign: 'left',
    flexGrow: 1,
  },
  bookTitle: {
    margin: '0 0 5px 0',
    fontSize: '1.2em',
    color: '#333',
  },
  bookAuthor: {
    margin: '0 0 5px 0',
    color: '#666',
    fontSize: '0.9em',
  },
  bookStatus: {
    margin: '0',
    color: '#555',
    fontSize: '0.85em',
    fontWeight: 'bold',
  },
  bookDate: {
    margin: '0',
    color: '#888',
    fontSize: '0.75em',
  },
  bookActions: {
    display: 'flex',
    gap: '10px',
    marginLeft: '20px',
  },
  markReadButton: {
    backgroundColor: '#28a745', // Green
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  markUnreadButton: {
    backgroundColor: '#ffc107', // Yellow/Orange
    color: '#333',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  noBooksMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: '20px',
    fontSize: '1.1em',
  },
};

export default BookList;