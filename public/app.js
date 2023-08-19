/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.getElementById('signupButton');
    const loginButton = document.getElementById('loginButton');
  
    signupButton.addEventListener('click', () => {
      // Redirect to signup page
      window.location.href = '/signup';
    });
  
    loginButton.addEventListener('click', () => {
      // Redirect to login page
      window.location.href = '/login';
    });
  });
  