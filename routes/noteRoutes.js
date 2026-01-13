const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js'); 
const Note = require('../models/Note');

// 1. OBTENER TODAS LAS NOTAS
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Error al obtener notas');
  }
});

// 2. CREAR UNA NOTA
router.post('/', auth, async (req, res) => {
  const { title, content, color, todos } = req.body;

  try {
    const nuevaNota = new Note({
      title,
      content,
      color: color || '#fff4b3', 
      todos: todos || [],
      user: req.user.id // Importante: viene del middleware auth
    });

    const note = await nuevaNota.save();
    res.json(note);
  } catch (err) {
    // IMPORTANTE: Mira tu terminal de VS Code para ver este error
    console.error("Error detallado al guardar:", err);
    res.status(500).send('Error al guardar la nota');
  }
});

// 3. ELIMINAR UNA NOTA
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Nota no encontrada' });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Nota eliminada' });
  } catch (err) {
    res.status(500).send('Error al eliminar');
  }
});

// 4. ACTUALIZAR UNA NOTA (CORREGIDO E INLINE)
// 4. ACTUALIZAR UNA NOTA (Línea 70 aprox)
router.put('/:id', auth, async (req, res) => {
  // 🚩 LA CORRECCIÓN: Asegúrate de incluir 'todos' aquí
  const { title, content, color, todos } = req.body; 

  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Nota no encontrada' });

    // Verificar dueño
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // Actualizar los campos incluyendo 'todos'
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          title, 
          content, 
          color, 
          todos: todos || [] // 👈 Si 'todos' no viene, enviamos un array vacío
        } 
      },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).send('Error al actualizar la nota');
  }
});

module.exports = router;

