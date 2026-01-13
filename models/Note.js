const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  // Relación con el usuario (Importante para que cada uno vea sus notas)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'The note content cannot be empty']
  },
  // Arreglo de objetos para los Checkboxes
  todos: [
    {
      text: { type: String },
      completed: { type: Boolean, default: false }
    }
  ],
  color: {
    type: String,
    default: '#fff4b3'
  },
  tag: {
    type: String,
    default: 'General'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);