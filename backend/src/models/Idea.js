const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título de la idea es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true
    },
    imagen: {
      type: String,
      required: [true, 'La ruta o URL de la imagen es obligatoria']
    },
    autor: {
      type: String,
      required: [true, 'El nombre del autor es obligatorio'],
      trim: true
    },
    cargo: {
      type: String,
      required: [true, 'El cargo del autor es obligatorio'],
      trim: true
    },
    autorImg: {
      type: String,
      required: [true, 'La foto del autor es obligatoria']
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

const Idea = mongoose.model('Idea', ideaSchema);

module.exports = Idea;
