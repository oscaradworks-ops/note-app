import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Dashboard = () => {
  const [nombre, setNombre] = useState('There');
  const [notas, setNotas] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [notaEditandoId, setNotaEditandoId] = useState(null);
  
  // ESTADOS PARA CHECKBOXES
  const [nuevaNota, setNuevaNota] = useState({
    title: '',
    content: '',
    color: '#fff4b3',
    todos: [] // Arreglo para las tareas
  });
  const [nuevoItemTexto, setNuevoItemTexto] = useState(""); // Texto de la tarea actual

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const nombreGuardado = localStorage.getItem('nombreUsuario');
      if (nombreGuardado) setNombre(nombreGuardado);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/'); return; }
      try {
        const res = await axios.get('http://localhost:5000/api/notes', {
          headers: { 'x-auth-token': token }
        });
        if (Array.isArray(res.data)) setNotas(res.data);
      } catch (err) { console.error("Error cargando notas:", err); }
    };
    cargarDatos();
  }, [navigate]);

  // --- LÓGICA DE CHECKBOXES EN EL FORMULARIO ---
  const agregarItemALista = () => {
    if (nuevoItemTexto.trim() === "") return;
    setNuevaNota({
      ...nuevaNota,
      todos: [...nuevaNota.todos, { text: nuevoItemTexto, completed: false }]
    });
    setNuevoItemTexto("");
  };

  const eliminarItemDeLista = (index) => {
    setNuevaNota({
      ...nuevaNota,
      todos: nuevaNota.todos.filter((_, i) => i !== index)
    });
  };

  // --- LÓGICA DE INTERACCIÓN CON NOTAS GUARDADAS ---
  const toggleTodoStatus = async (notaId, todoId) => {
    const token = localStorage.getItem('token');
    const notaOriginal = notas.find(n => n._id === notaId);
    
    const todosActualizados = notaOriginal.todos.map(t => 
      t._id === todoId ? { ...t, completed: !t.completed } : t
    );

    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${notaId}`, 
        { ...notaOriginal, todos: todosActualizados },
        { headers: { 'x-auth-token': token } }
      );
      setNotas(notas.map(n => n._id === notaId ? res.data : n));
    } catch (err) { console.error("Error al actualizar checkbox", err); }
  };

  const manejarNota = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  try {
    if (notaEditandoId) {
      const res = await axios.put(`http://localhost:5000/api/notes/${notaEditandoId}`, nuevaNota, config);
      setNotas(notas.map(nota => nota._id === notaEditandoId ? res.data : nota));
      setNotaEditandoId(null);
    } else {
      const res = await axios.post('http://localhost:5000/api/notes', nuevaNota, config);
      setNotas([...notas, res.data]);
    }

    // ✨ MEJORA: Limpiamos TODO para la siguiente nota
    setNuevaNota({ title: '', content: '', color: '#fff4b3', todos: [] });
    setNuevoItemTexto(""); // Limpia el campito de "New task..." que definimos antes
    
  } catch (err) { 
    console.error("Error al guardar:", err.response?.data || err.message);
    alert("Error al guardar la nota"); 
  }
};

  const eliminarNota = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers: { 'x-auth-token': token } });
      setNotas(notas.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const notasFiltradas = notas.filter((nota) =>
    nota.title.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    nota.content.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar nombreUsuario={nombre} terminoBusqueda={terminoBusqueda} setTerminoBusqueda={setTerminoBusqueda} />

      <div style={{ padding: '2rem' }}>
        {/* FORMULARIO */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>{notaEditandoId ? 'Edit Note ✏️' : 'Create New Note ✨'}</h3>
          <form onSubmit={manejarNota} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text" placeholder="Title" value={nuevaNota.title}
              onChange={(e) => setNuevaNota({ ...nuevaNota, title: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <textarea
              placeholder="Content" value={nuevaNota.content}
              onChange={(e) => setNuevaNota({ ...nuevaNota, content: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px' }}
            />

            {/* SECCIÓN DE AÑADIR TAREAS (CHECKBOXES) */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Add Checklist items:</p>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input 
                  type="text" placeholder="New task..." value={nuevoItemTexto}
                  onChange={(e) => setNuevoItemTexto(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button type="button" onClick={agregarItemALista} style={{ background: '#6c5ce7', color: 'white', border: 'none', padding: '0 15px', borderRadius: '5px', cursor: 'pointer' }}>+</button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {nuevaNota.todos.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span>• {item.text}</span>
                    <button type="button" onClick={() => eliminarItemDeLista(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
                  </li>
                ))}
              </ul>
            </div>

            <button type="submit" style={{ padding: '10px', backgroundColor: notaEditandoId ? '#fdcb6e' : '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {notaEditandoId ? 'Update Note' : 'Save Note'}
            </button>
          </form>
        </div>

        {/* LISTA DE NOTAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          <AnimatePresence>
            {notasFiltradas.map((nota) => (
              <motion.div
                key={nota._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ backgroundColor: nota.color || '#fff4b3', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
              >
                <h4 style={{ margin: '0 0 10px 0' }}>{nota.title}</h4>
                <p style={{ fontSize: '0.95rem' }}>{nota.content}</p>

                {/* RENDERIZADO DE CHECKBOXES EN LA NOTA */}
                {nota.todos && nota.todos.length > 0 && (
                  <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    {nota.todos.map((todo) => (
                      <div key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <input 
                          type="checkbox" 
                          checked={todo.completed} 
                          onChange={() => toggleTodoStatus(nota._id, todo._id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ 
                          textDecoration: todo.completed ?'line-through' : 'none',
                          color: todo.completed ? '#888' : '#333',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem', 
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#888' : '#333'
                        }}>
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => { setNotaEditandoId(nota._id); setNuevaNota(nota); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: '1px solid #666', borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 8px' }}>Edit ✏️</button>
                  <button onClick={() => eliminarNota(nota._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#d63031' }}>Delete 🗑️</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;