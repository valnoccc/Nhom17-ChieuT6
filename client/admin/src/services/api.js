// services/api.js
const API_BASE_URL = 'http://localhost:10000'; // From your index.js

export const adminAPI = {
  // Users
  getAllUsers: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()),
  getUserById: (id) => fetch(`${API_BASE_URL}/users/${id}`).then(res => res.json()),
  addUser: (userData) => fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json()),
  updateUser: (id, userData) => fetch(`${API_BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json()),
  deleteUser: (id) => fetch(`${API_BASE_URL}/delete/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  
  // Furniture - placeholder for now
  furniture: {
    getAll: () => console.log('Furniture API coming soon'),
    // Add more as backend develops
  }
};
