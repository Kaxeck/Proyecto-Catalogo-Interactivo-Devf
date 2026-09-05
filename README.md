# 🛋️ DecoHome — Catálogo Interactivo de Muebles

Proyecto Final individual desarrollado bajo el stack MERN (MongoDB, Express, React con Vite, Node.js), enfocado en la exploración interactiva, filtrado y gestión de mobiliario para el hogar y oficina.

---

## 📋 Descripción del Proyecto

**DecoHome** es una aplicación web interactiva diseñada para la visualización y exploración ágil de un catálogo de muebles contemporáneos. La plataforma permite a los usuarios:

* 🗂️ Navegar por colecciones organizadas por categorías (Salas, Recámaras, Comedores, Oficina y Exterior).
* 🔍 Realizar búsquedas en tiempo real.
* 💰 Filtrar por rango de precios y disponibilidad de stock.
* 📄 Consultar la ficha técnica individual de cada mueble.
* 🛒 Gestionar un carrito de compras protegido con autenticación de usuarios basada en JWT.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React, Vite, Tailwind CSS, React Router DOM, React Hook Form, Zod, Axios.
* **Backend:** Node.js, Express.js, Mongoose.
* **Base de Datos:** MongoDB Atlas.
* **Autenticación:** JSON Web Tokens (JWT) y cifrado de contraseñas con bcryptjs.

---

## 📁 Estructura del Repositorio

```text
catalogo-muebles/
├── frontend/             # Aplicación cliente en React + Vite
├── backend/              # Servidor API REST en Express + Mongoose
├── .gitignore            # Exclusión de archivos y carpetas sensibles / dependencias
└── README.md             # Documentación del proyecto
```

---

## 🚀 Instalación y Puesta en Marcha Local

### Prerrequisitos
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [Git](https://git-scm.com/)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Kaxeck/Proyecto-Catalogo-Interactivo-Devf.git
cd Proyecto-Catalogo-Interactivo-Devf
```

### 2. Configuración del Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación cliente estará disponible en `http://localhost:5173/`.

### 3. Configuración del Backend
*(Una vez inicializado el servidor)*
```bash
cd backend
npm install
npm run dev
```

---

## 🌿 Dinámica de Trabajo con Git Flow

El desarrollo del proyecto sigue el estándar de ramificación Git Flow:

* **`main`:** Código estable listo para despliegue en producción.
* **`develop`:** Rama integradora donde convergen todas las características probadas.
* **`feature/*`:** Ramas independientes para cada módulo (ej. `feature/setup-vite-architecture`, `feature/products-api`).
* **Integración:** Ningún commit se realiza directo a `main`. Todo cambio pasa por Pull Request hacia `develop`.

---

## 👤 Desarrollador

* **Autor:** [@Kaxeck](https://github.com/Kaxeck)
* **Modalidad:** Proyecto Individual
* **Rol:** Full-Stack Developer