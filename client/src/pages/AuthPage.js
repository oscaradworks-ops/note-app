import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = () => {
  // 1. Estados para saber si estamos en Login o Registro
  const [esRegistro, setEsRegistro] = useState(false);

  // 2. Estados para los datos del formulario
  const [datos, setDatos] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Función para manejar los cambios en los cuadritos (Inputs)
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  //SE PUSO DESPUES
  const handleSubmit = async (e) => {
  e.preventDefault(); // Evita que la página se recargue
  
  try {
    // Definimos a qué dirección enviar los datos
    const url = esRegistro 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    const respuesta = await axios.post(url, datos);

    if (!esRegistro) {
      // Si es Login, guardamos el Token en el "casillero" del navegador
      localStorage.setItem('token', respuesta.data.token);
      alert('Wellcome again! 🎉');
      // Aquí es donde mandaremos al usuario al Dashboard más adelante
    } else {
      alert('Account Created! Now you can sign in. ✨');
      setEsRegistro(false); // Lo mandamos al login
    }
  } catch (error) {
    alert(error.response?.data?.mensaje || 'Something went wrong 😕');
  }
};

  return (
    <div className="auth-container">
      <h1>{esRegistro ? 'Create my Account 🚀' : 'Hi Again! 👋'}</h1>
      
      <form>
        {esRegistro && (
          <input 
            name="name" 
            placeholder="Your Name" 
            onChange={handleChange} 
          />
        )}
        <input 
          name="email" 
          type="email" 
          placeholder="Your E-mail" 
          onChange={handleChange} 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Secret Password" 
          onChange={handleChange} 
        />
        
        <button type="submit">
          {esRegistro ? 'Register' : 'Sign in'}
        </button>
      </form>

      <p onClick={() => setEsRegistro(!esRegistro)} style={{cursor: 'pointer'}}>
        {esRegistro ? 'Alredy registered? Log in here' : 'New here? Create an Account'}
      </p>
    </div>
  );
};

export default AuthPage;