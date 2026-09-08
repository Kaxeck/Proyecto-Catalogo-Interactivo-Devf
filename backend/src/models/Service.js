const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    icono: {
      type: String,
      required: [true, 'El icono es obligatorio']
    },
    titulo1: {
      type: String,
      required: [true, 'El título principal es obligatorio'],
      trim: true
    },
    titulo2: {
      type: String,
      required: [true, 'El subtítulo es obligatorio'],
      trim: true
    },
    descripcion1: {
      type: String,
      required: [true, 'La descripción 1 es obligatoria'],
      trim: true
    },
    descripcion2: {
      type: String,
      required: [true, 'La descripción 2 es obligatoria'],
      trim: true
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

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
