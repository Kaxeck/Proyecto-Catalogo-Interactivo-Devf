const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['Salas', 'Comedores', 'Recámaras', 'Estanterías', 'Oficina', 'Decoración', 'Sillas']
    },
    precioOriginal: {
      type: Number,
      required: [true, 'El precio original es obligatorio']
    },
    precioDescuento: {
      type: Number,
      default: null
    },
    imagen: {
      type: String,
      required: [true, 'La URL o ruta de la imagen es obligatoria']
    },
    isOfertaPlus: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción del producto es obligatoria']
    },
    dimensiones: {
      type: String,
      required: [true, 'Las dimensiones son obligatorias']
    },
    materiales: {
      type: String,
      required: [true, 'Los materiales son obligatorios']
    },
    garantia: {
      type: String,
      default: '1 año de garantía directa'
    },
    stock: {
      type: Number,
      default: 10,
      min: [0, 'El stock no puede ser negativo']
    },
    rating: {
      type: Number,
      default: 5.0
    },
    opinionesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
