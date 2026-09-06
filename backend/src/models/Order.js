const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio']
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'El ID del producto es obligatorio']
        },
        cantidad: {
          type: Number,
          required: [true, 'La cantidad es obligatoria'],
          min: [1, 'La cantidad mínima es 1']
        },
        precioUnitario: {
          type: Number,
          required: [true, 'El precio unitario es obligatorio']
        }
      }
    ],
    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio']
    },
    costoEnvio: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio']
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
      default: 'pagado'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
