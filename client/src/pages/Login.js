import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 📡 Enviamos los datos al Backend
      // En Login.js, dentro de handleLogin:
const respuesta = await axios.post('http://localhost:5000/api/auth/login', { email, password });

console.log("Server Response Completed:", respuesta.data); // <--- AÑADE ESTO

localStorage.setItem('token', respuesta.data.token);
      
      // Verificamos si el backend devuelve el nombre dentro de 'user'
      if (respuesta.data.user && respuesta.data.user.name) {
        localStorage.setItem('nombreUsuario', respuesta.data.user.name);
      }

      // 🚀 ¡Al dashboard!
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Password or Email incorrect. ❌');
    }
  }; // <--- Aquí cerramos correctamente la función handleLogin

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ textAlign: 'center', color: '#6c5ce7' }}> See your Notes! 📝</h2>
        
        {error && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Tu correo" 
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
          />
          <input 
            type="password" 
            placeholder="Tu contraseña" 
            required
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ 
            padding: '12px', backgroundColor: '#6c5ce7', color: 'white', 
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' 
          }}>
            Login
          </button>
        </form>
      
<p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#636e72' }}>
  Not an account yet? {' '}
  <span 
    onClick={() => navigate('/register')} 
    style={{ color: '#6c5ce7', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
  >
    Regíster here
  </span>
</p>
      </div>
    </div>
  );
};

export default Login;