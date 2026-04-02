import React from 'react';
import { Link } from 'react-router-dom';

const Nicetry = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">❌ Nice Try Diddy!</h1>
        <p className="text-2xl text-gray-700 mb-6">You don't have admin access</p>
        <p className="text-gray-600 mb-8">Only administrators can access the admin panel.</p>
        
        <Link 
          to="/login" 
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Nicetry;