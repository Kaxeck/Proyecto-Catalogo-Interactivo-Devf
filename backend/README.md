# 🛋️ Backend API RESTful - Proyecto Catálogo Interactivo (Devf)

API RESTful desarrollada con **Node.js**, **Express** y **MongoDB Atlas** (Mongoose) para la gestión de usuarios, catálogo de muebles en oferta y procesamiento de compras desde el carrito.

---

## 🛠️ Tecnologías y Librerías Utilizadas

- **Core**: Node.js, Express.js
- **Base de Datos**: MongoDB Atlas, Mongoose
- **Autenticación & Seguridad**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`
- **Configuración & Dev Tools**: `dotenv`, `nodemon`

---

## 📁 Arquitectura del Proyecto

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Conexión a MongoDB Atlas mediante Mongoose
│   ├── models/
│   │   ├── User.js               # Esquema de Usuario (roles, bcryptjs pre-save)
│   │   ├── Product.js            # Esquema de Producto (atributos y ficha técnica)
│   │   └── Order.js              # Esquema de Pedidos (referencias a User y Product)
│   ├── controllers/
│   │   ├── authController.js     # Lógica de Registro, Login y Perfil
│   │   ├── productController.js  # Lógica de Catálogo, Promociones y Detalle por ID
│   │   └── orderController.js    # Lógica de Creación e Historial de Pedidos
│   ├── routes/
│   │   ├── authRoutes.js         # Endpoints de Autenticación (/api/auth)
│   │   ├── productRoutes.js      # Endpoints de Catálogo (/api/products)
│   │   └── orderRoutes.js        # Endpoints de Compras (/api/orders)
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Middleware para validación de JWT Bearer Token
│   │   └── errorHandler.js       # Manejador centralizado de errores HTTP y 404
│   ├── seeds/
│   │   └── seedProducts.js       # Script de carga inicial de muebles a la BD
│   └── index.js                  # Inicialización de Express, CORS y servidor
├── .env                          # Variables de entorno locales
├── .env.example                  # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## 🚀 Guía de Instalación y Uso

### 1. Instalación de Dependencias
```bash
cd backend
npm install
```

### 2. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz de `backend/` basándote en la plantilla `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://tu_usuario:tu_password@cluster0.mongodb.net/catalogo_db?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura
FRONTEND_URL=http://localhost:5173
```

### 3. Carga Inicial de Datos (Seeder)
Ejecuta el script para poblar MongoDB Atlas con los muebles del catálogo original:
```bash
npm run seed
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

El servidor estará escuchando en `http://localhost:5000`.

---

## 📡 Endpoints de la API REST

### 🔑 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Requiere JWT |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Registro de nuevo usuario (retorna JWT) | No |
| `POST` | `/api/auth/login` | Inicio de sesión (retorna JWT) | No |
| `GET` | `/api/auth/profile` | Obtener perfil del usuario autenticado | **Sí** |

#### Ejemplo Body `POST /api/auth/register`:
```json
{
  "nombre": "Saul Garcia",
  "email": "saul@ejemplo.com",
  "password": "password123",
  "telefono": "5512345678"
}
```

---

### 📦 Catálogo y Productos (`/api/products`)

| Método | Endpoint | Descripción | Requiere JWT |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/products` | Catálogo completo (soporta `?categoria=Salas&search=silla`) | No |
| `GET` | `/api/products/promociones` | Muebles en promoción (`isOfertaPlus` o con descuento) | No |
| `GET` | `/api/products/:id` | Ficha técnica individual de un mueble por ID | No |

---

### 🛒 Pedidos y Compras (`/api/orders`)

| Método | Endpoint | Descripción | Requiere JWT |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/orders` | Procesar orden de compra desde el carrito | **Sí** |
| `GET` | `/api/orders/my-orders` | Historial de compras del usuario autenticado | **Sí** |

#### Ejemplo Body `POST /api/orders`:
```json
{
  "productos": [
    {
      "producto": "66d9f8a12b3c4d5e6f7a8b9c",
      "cantidad": 2,
      "precioUnitario": 250
    }
  ],
  "subtotal": 500,
  "costoEnvio": 0,
  "total": 500
}
```
