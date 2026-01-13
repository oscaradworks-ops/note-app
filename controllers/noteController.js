const Note = require('../models/Note');

// Función para crear una nota nueva
exports.createNote = async (req, res) => {
  try {
    const { title, content, color, tag } = req.body;

    const nuevaNota = new Note({
      title,
      content,
      color,
      tag,
      user: req.usuario // 👈 ¡Aquí grabamos quién es el dueño!
    });

    await nuevaNota.save();
    res.status(201).json(nuevaNota);
  } catch (error) {
    res.status(500).json({ mensaje: 'Create Note Error' });
  }
};



// Función para obtener todas las notas
exports.getNotes = async (req, res) => {
  try {
    // Buscamos solo las notas donde el campo 'user' sea igual al ID del logueado 🔍
    const notas = await Note.find({ user: req.usuario }).sort({ date: -1 });
    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Fetch Notes Error' });
  }
};



// 3. ACTUALIZAR NOTA
exports.actualizarNota = async (req, res) => {
  const { title, content } = req.body;

  try {
    // A. Buscar la nota por el ID que viene en la URL
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Nota no encontrada' });
    }

    // B. Verificar que el usuario sea el DUEÑO de la nota
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // C. Actualizar
    const nuevaNota = { title, content };
    
    // new: true devuelve la nota ya actualizada
    note = await Note.findByIdAndUpdate(req.params.id, { $set: nuevaNota }, { new: true });

    res.json(note);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// Función para BORRAR una nota
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Note Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Note Couldnt be Deleted' });
  }
};
//VERIFICADO HASTA AQUI