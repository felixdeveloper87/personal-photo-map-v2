import React, { createContext, useState } from 'react';

// Create and export AuthContext to manage user authentication globally
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * This component provides a context for managing authentication state across the application.
 * It stores login status, fullname, and email, and exposes methods to log in and log out.
 * Children components can consume this context to access authentication data and actions.
 */
export const AuthProvider = ({ children }) => {
  // State to track if the user is logged in. Defaults to true if a token is found in localStorage.
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  // State to store the fullname of the currently logged-in user, retrieved from localStorage.
  const [fullname, setFullname] = useState(localStorage.getItem('fullname') || '');
  // State to store the email of the currently logged-in user, retrieved from localStorage.
  const [email, setEmail] = useState(localStorage.getItem('email') || '');

  /**
   * login - Handles the login process
   * This function updates localStorage and sets the context state with user information.
   * It also triggers a `storage` event to notify other parts of the application or browser tabs.
   *
   * @param {string} token - The authentication token for the user.
   * @param {string} fullName - The full name of the logged-in user.
   * @param {string} userEmail - The email address of the logged-in user.
   */
  const login = (token, fullName, userEmail) => {
    // Save user credentials and token in localStorage for persistence across sessions
    localStorage.setItem('token', token);
    localStorage.setItem('fullname', fullName);
    localStorage.setItem('email', userEmail);

    // Update the local state to reflect the logged-in user
    setIsLoggedIn(true);
    setFullname(fullName);
    setEmail(userEmail);

    // Dispatch a 'storage' event to notify other tabs or components
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * logout - Handles the logout process
   * This function clears user information from localStorage and resets the context state.
   * It also triggers a `storage` event to notify other parts of the application or browser tabs.
   */
  const logout = () => {
    // Clear user credentials from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('email');

    // Reset the local state to indicate no user is logged in
    setIsLoggedIn(false);
    setFullname('');
    setEmail('');

    // Dispatch a 'storage' event to notify other tabs or components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    // Provide authentication state and functions to child components
    <AuthContext.Provider value={{ isLoggedIn, fullname, email, login, logout }}>
      {children} {/* Render the components wrapped by this provider */}
    </AuthContext.Provider>
  );
};
