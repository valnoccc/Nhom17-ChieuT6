import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const BASE_URL = "https://nhom17-chieut6.onrender.com"; // URL Backend Render

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${BASE_URL}/update/${formData.id}` : `${BASE_URL}/add`;
    const method = isEditing ? 'PUT' : 'POST';

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setFormData({ id: '', name: '', email: '', phone: '' });
    setIsEditing(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Xác nhận xóa?")) {
      await fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="container">
      <h1>Hệ thống Quản trị (Admin)</h1>
      <form onSubmit={saveUser} className="form-group">
        <input type="text" placeholder="Tên" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        <input type="text" placeholder="SĐT" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        <button type="submit" className={isEditing ? "btn-edit" : "btn-add"}>
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button className="btn-edit" onClick={() => { setFormData(u); setIsEditing(true); }}>Sửa</button>
                <button className="btn-delete" onClick={() => deleteUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;