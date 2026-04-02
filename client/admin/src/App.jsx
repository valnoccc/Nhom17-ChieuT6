import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import UserList from './components/Users/UserList';
import ProductList from './components/Products/ProductList';
import OrderList from './components/Orders/OrderList';
import CategoryList from './components/Categories/CategoryList';
import AdminHeader from './components/Layout/AdminHeader';
import PageWrapper from './components/Layout/PageWrapper';
// import './App.css'; // optional, we'll use Tailwind

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // For demo - in real app, get from auth context/localStorage
  const adminName = "Admin User"; // You can replace with actual admin name from your auth

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Use the AdminHeader component instead of the inline header */}
      <AdminHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        adminName={adminName}
      />

      {/* Main content - keep this the same */}
      <div className="py-6 sm:px-6 lg:px-8">
        <PageWrapper>
          {activeTab === 'dashboard' ? <Dashboard /> : 
           activeTab === 'users' ? <UserList /> : 
           activeTab === 'products' ? (
            <ProductList />
          ) : activeTab === 'orders' ? (       
            <OrderList />
          ) : activeTab === 'categories' ? (
            <CategoryList />
          ) : activeTab === 'settings' ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">⚙️ Settings</h2>
              <p className="text-gray-500 mt-2">Coming soon...</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">🚧 Under Construction</h2>
              <p className="text-gray-500 mt-2">This section is coming soon...</p>
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  );
}

export default App;
