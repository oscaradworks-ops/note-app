import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  // 1. Cambiamos 'username' por 'name' para que coincida con tu Backend
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 📡 Ahora enviamos 'name', 'email' y 'password'
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Successfully user created! 🎉');
      navigate('/'); // Te redirige al login
    } catch (err) {
      // Si hay error, ahora veremos exactamente qué dice el servidor
      alert('Register Error : ' + (err.response?.data?.msg || 'Try again'));
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <form onSubmit={handleRegister} style={{ background: 'white', padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '300px' }}>
        <h2 style={{ textAlign: 'center', color: '#6c5ce7' }}>Create Account 📝</h2>
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
          style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}
        />
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
          style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}
        />
        
        <input 
          type="password" 
          placeholder="Your Password" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
          style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}
        />
        
        <button type="submit" style={{padding:'12px', backgroundColor:'#6c5ce7', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
          Register
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Already an account? <span onClick={() => navigate('/')} style={{ color: '#6c5ce7', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;