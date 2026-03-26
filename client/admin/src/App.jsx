import React, { useState } from 'react';
import UserList from './components/Users/UserList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container">
      <h1>Hệ thống Quản trị (Admin)</h1>
      
      <div className="nav-buttons">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Quản lý Người dùng
        </button>
        
        <button 
          className={activeTab === 'furniture' ? 'active' : ''}
          onClick={() => setActiveTab('furniture')}
        >
          🪑 Quản lý Nội thất
        </button>
      </div>

      <div className="content">
        {activeTab === 'users' ? <UserList /> : 
         <div style={{ textAlign: 'center', padding: '50px' }}>
           <h2>🚧 Đang phát triển</h2>
           <p>Quản lý nội thất sẽ sớm được cập nhật</p>
          
         </div>
        }
      </div>
    </div>
  );
}
export default App;