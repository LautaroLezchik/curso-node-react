import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Your Book Library!</h1>
      <p>Manage your read and unread books easily.</p>
      <p>Please <a href="/login">login</a> or <a href="/register">register</a> to get started.</p>
    </div>
  );
};

export default HomePage;