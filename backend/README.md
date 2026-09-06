# 📋 Especificaciones de Desarrollo del Backend y Estructura de Base de Datos

Este documento detalla **todo el trabajo que debe realizar el desarrollador backend**, la **estructura completa de la base de datos** en MongoDB y el **contrato de integración de la API REST** que consume el Frontend de DecoHome / Muebles Nordic.

---

## 📌 1. Todo lo que tiene que hacer el Desarrollador Backend (Checklist)

### A. Configuración y Servidor
- [ ] Inicializar el proyecto con `npm init -y` e instalar dependencias del stack:
  - Servidor: `express`, `dotenv`, `cors`.
  - Base de Datos: `mongoose`.
  - Seguridad y Auth: `bcryptjs`, `jsonwebtoken`.
  - Validaciones: `express-validator` o `Joi`.
  - Desarrollo: `nodemon`.
- [ ] Configurar variables de entorno mediante un archivo `.env` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`).
- [ ] Configurar **CORS** para habilitar la comunicación exclusiva con el cliente Frontend en `http://localhost:5173`.
- [ ] Crear un archivo inicial o script de **Sembrado (Seed)** con los productos base para que el catálogo tenga información lista.

### B. Base de Datos (MongoDB Atlas)
- [ ] Crear el Cluster en MongoDB Atlas y configurar el usuario con permisos de lectura/escritura y acceso por IP (`0.0.0.0/0` para desarrollo).
- [ ] Implementar la conexión persistente con Mongoose capturando eventos de éxito y error.
- [ ] Modelar las **4 colecciones requeridas**: `users`, `products`, `orders` y `subscribers` con sus tipos, restricciones, índices y valores por defecto.

### C. Lógica de Autenticación y Seguridad
- [ ] Encriptar contraseñas antes de guardarlas en la base de datos usando **bcryptjs** con salt rounds (mínimo 10).
- [ ] Generar **JSON Web Tokens (JWT)** firmados con tiempo de expiración (ej. 8 horas) tras login o registro exitoso.
- [ ] Desarrollar el middleware de autorización (`protect` o `authMiddleware`) que extraiga el token de la cabecera `Authorization: Bearer <token>`, lo verifique y cargue el usuario en `req.user`.
- [ ] Excluir estrictamente el campo `password` de todas las consultas que retornen datos de usuario al cliente (`select('-password')`).

### D. Rutas, Controladores y Validaciones
- [ ] Validar y sanitizar cada parámetro recibido antes de procesarlo en la base de datos.
- [ ] Responder con códigos HTTP semánticos (`200`, `201`, `400`, `401`, `404`, `500`).
- [ ] Desarrollar un **middleware centralizado de manejo de errores** (`errorHandler`) para evitar que excepciones no controladas tiren el servidor.

---

## 🗄️ 2. Estructura de la Base de Datos (Colecciones NoSQL / Mongoose)

### Colección 1: `users` (Usuarios y Clientes)
Almacena las cuentas registradas para gestionar la sesión, perfil e historial.

| Campo | Tipo de Dato | Restricciones / Reglas | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Clave primaria automática | Identificador único del usuario |
| `name` | String | Requerido, Trim, Mínimo 3 caracteres | Nombre completo del usuario |
| `email` | String | Requerido, Trim, Único, Minúsculas, Regex de Email | Correo electrónico de acceso |
| `password` | String | Requerido, Mínimo 6 caracteres | Hash encriptado con bcrypt (no texto plano) |
| `telefono` | String | Opcional, Trim | Teléfono de contacto para entregas |
| `role` | String | Enum: `['user', 'admin']`, Default: `'user'` | Rol de permisos dentro de la plataforma |
| `createdAt` | Date | Timestamp automático | Fecha de creación de la cuenta |
| `updatedAt` | Date | Timestamp automático | Fecha de última actualización |

* **Índices recomendados:** `{ email: 1 }` (único).

---

### Colección 2: `products` (Catálogo de Muebles)
Almacena todos los muebles disponibles para exploración, filtrado y compras.

| Campo | Tipo de Dato | Restricciones / Reglas | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Clave primaria automática | Identificador del producto |
| `nombre` | String | Requerido, Trim, Índice de texto | Nombre comercial del mueble |
| `categoria` | String | Requerido, Enum: `['Salas', 'Comedores', 'Recámaras', 'Estanterías', 'Oficina', 'Decoración']` | Categoría principal del catálogo |
| `precioOriginal` | Number | Requerido, Mínimo 0 | Precio base de lista |
| `precioDescuento`| Number | Opcional, Mínimo 0 | Precio especial en oferta |
| `enDescuento` | Boolean | Default: `false` | Indica si el producto tiene promoción activa |
| `imagen` | String | Requerido | URL o ruta de la imagen principal |
| `galeria` | Array de Strings | Opcional | Lista de URLs de imágenes secundarias |
| `stock` | Number | Requerido, Mínimo 0, Default: `1` | Existencias disponibles para venta |
| `descripcion` | String | Requerido, Trim | Descripción técnica y estilística |
| `detalles` | Object | Opcional | Subdocumento: `{ materiales: String, dimensiones: String, garantia: String }` |
| `rating` | Number | Mínimo 0, Máximo 5, Default: `5` | Calificación promedio |
| `createdAt` | Date | Timestamp automático | Fecha de ingreso al inventario |

* **Índices recomendados:** `{ nombre: "text", categoria: 1, precioOriginal: 1 }`.

---

### Colección 3: `orders` (Pedidos y Checkout)
Registra las compras realizadas por usuarios autenticados o clientes invitados.

| Campo | Tipo de Dato | Restricciones / Reglas | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Clave primaria automática | Número / ID de la orden |
| `usuario` | ObjectId | Opcional, Referencia a `users` (`ref: 'User'`) | Usuario que realizó la compra (si está logueado) |
| `cliente` | Object | Requerido | Subdocumento: `{ nombre, email, telefono, direccion }` |
| `items` | Array de Objetos | Requerido, No vacío | Lista de artículos comprados: |
| ↳ `producto` | ObjectId | Requerido, Referencia a `products` | Referencia al mueble adquirido |
| ↳ `nombre` | String | Requerido | Nombre del producto al momento de comprar |
| ↳ `precio` | Number | Requerido, Mínimo 0 | Precio unitario cobrado |
| ↳ `cantidad`| Number | Requerido, Mínimo 1 | Cantidad de piezas adquiridas |
| ↳ `imagen` | String | Opcional | Imagen miniatura del artículo |
| `subtotal` | Number | Requerido, Mínimo 0 | Suma del valor de los productos |
| `costoEnvio`| Number | Default: `0` | Costo de entrega calculado |
| `total` | Number | Requerido, Mínimo 0 | Monto final cobrado |
| `estado` | String | Enum: `['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']`, Default: `'pendiente'` | Estado del ciclo de vida del pedido |
| `createdAt` | Date | Timestamp automático | Fecha y hora de compra |

---

### Colección 4: `subscribers` (Newsletter)
Almacena los correos registrados en el pie de página para campañas promocionales.

| Campo | Tipo de Dato | Restricciones / Reglas | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Clave primaria automática | Identificador único |
| `email` | String | Requerido, Trim, Único, Minúsculas, Regex Email | Correo electrónico del suscriptor |
| `fechaSuscripcion` | Date | Default: `Date.now` | Momento exacto del registro |

* **Índices recomendados:** `{ email: 1 }` (único).

---

## 📡 3. Contrato de Endpoints de la API REST (Rutas a Implementar)

La URL base debe ser: `http://localhost:5000/api`

### A. Autenticación y Perfil (`/api/auth`)
* `POST /api/auth/register`
  * **Acceso:** Público.
  * **Body:** `{ "name": "...", "email": "...", "password": "...", "telefono": "..." }`
  * **Respuesta 201:** `{ "success": true, "token": "JWT_AQUI", "user": { "id": "...", "nombre": "...", "email": "..." } }`
  * **Respuesta 400:** Si faltan datos, el correo ya existe o la contraseña es menor a 6 caracteres.
* `POST /api/auth/login`
  * **Acceso:** Público.
  * **Body:** `{ "email": "...", "password": "..." }`
  * **Respuesta 200:** `{ "success": true, "token": "JWT_AQUI", "user": { "id": "...", "nombre": "...", "email": "..." } }`
  * **Respuesta 401:** Credenciales inválidas.
* `GET /api/auth/profile`
  * **Acceso:** **Privado (Requiere JWT)**.
  * **Header obligatorio:** `Authorization: Bearer <token_jwt>`
  * **Respuesta 200:** `{ "success": true, "user": { "id": "...", "nombre": "...", "email": "...", "telefono": "...", "fechaRegistro": "..." } }`
  * **Respuesta 401:** Token no suministrado, inválido o expirado.

### B. Catálogo de Productos (`/api/products`)
* `GET /api/products`
  * **Acceso:** Público.
  * **Query Params opcionales:** `?q=mesa&category=Comedores&sort=menor`
  * **Respuesta 200:** `{ "success": true, "count": 12, "products": [...] }`
* `GET /api/products/:id`
  * **Acceso:** Público.
  * **Respuesta 200:** Objeto del producto solicitado.
  * **Respuesta 404:** Si el ID no existe en la base de datos.

### C. Pedidos (`/api/orders`)
* `POST /api/orders`
  * **Acceso:** Público / Autenticado.
  * **Body:** `{ "items": [...], "total": 12500, "cliente": { "nombre": "...", "email": "...", "direccion": "..." } }`
  * **Respuesta 201:** `{ "success": true, "orderId": "...", "message": "Pedido generado exitosamente" }`
  * **Respuesta 400:** Si `items` está vacío o faltan datos del cliente.

### D. Newsletter (`/api/newsletter`)
* `POST /api/newsletter`
  * **Acceso:** Público.
  * **Body:** `{ "email": "correo@ejemplo.com" }`
  * **Respuesta 201:** `{ "success": true, "message": "Suscripción exitosa" }`
  * **Respuesta 400:** Correo inválido o ya registrado.

---

## 🛡️ 4. Reglas de Validación y Manejo de Errores

1. **Validación en el Servidor:**
   * Usar `express-validator` o `Joi` para sanitizar entradas (eliminar caracteres HTML/scripts, normalizar correos a minúsculas y limitar longitudes de búsqueda a máx. 50 caracteres).
2. **Formato uniforme de respuestas de error:**
   * Cuando haya errores de validación (400), devolver un formato JSON legible:
     ```json
     { "errors": [{ "msg": "El correo electrónico es obligatorio", "path": "email" }] }
     ```
   * O mensaje simple:
     ```json
     { "message": "Descripción clara del problema" }
     ```
3. **Middleware Global `errorHandler`:**
   * Debe declararse después de todas las rutas para atrapar cualquier error no manejado y responder en JSON sin abortar el proceso de Node.js.

---

## ⚙️ 5. Ejemplo de Variables de Entorno (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/catalogo_nordic?retryWrites=true&w=majority
JWT_SECRET=clave_secreta_para_firmar_tokens_jwt_2026
NODE_ENV=development
```
