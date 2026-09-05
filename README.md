# 🛋️ DecoHome — Catálogo Interactivo de Muebles

Proyecto desarrollado bajo el stack MERN (MongoDB, Express, React con Vite, Node.js), enfocado en la exploración interactiva, filtrado y gestión de mobiliario para el hogar y oficina. La arquitectura está modularizada de forma desacoplada entre cliente (Frontend) y servidor (Backend y Base de Datos).

---

## 📋 Descripción del Proyecto

**DecoHome** es una aplicación web interactiva diseñada para la visualización y exploración ágil de un catálogo de muebles contemporáneos. La plataforma permite a los usuarios:

* 🗂️ Navegar por colecciones organizadas por categorías (Salas, Recámaras, Comedores, Oficina y Exterior).
* 🔍 Realizar búsquedas en tiempo real.
* 💰 Filtrar por rango de precios y disponibilidad de stock.
* 📄 Consultar la ficha técnica individual de cada mueble.
* 🛒 Gestionar un carrito de compras interactivo con persistencia local (preparado para integración con API/JWT).

---

## 🛠️ Stack Tecnológico

* **Frontend:** React, Vite, CSS Vanilla, React Router DOM, Boxicons.
* **Backend:** Node.js, Express.js, Mongoose *(en desarrollo colaborativo)*.
* **Base de Datos:** MongoDB Atlas *(a cargo del desarrollador backend)*.
* **Autenticación:** JSON Web Tokens (JWT) y cifrado con bcryptjs *(etapa backend)*.

---

## 📁 Estructura del Repositorio

```text
catalogo-muebles/
├── frontend/             # Aplicación cliente en React + Vite (Desarrollo Frontend)
├── backend/              # Servidor API REST en Express + Mongoose (Desarrollo Backend)
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
*(Módulo a cargo del desarrollador Backend y Base de Datos — en fase de construcción)*
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
* **`feature/*`:** Ramas independientes para cada módulo (ej. `feature/catalogo-frontend`, `feature/backend-api`).
* **Integración:** Ningún commit se realiza directo a `main`. Todo cambio pasa por Pull Request hacia `develop`.

---

## 👥 Equipo de Desarrollo y Roles

* **Frontend Developer:** [@Kaxeck](https://github.com/Kaxeck)
  * Responsable del diseño visual, maquetación responsive, componentes modulares, enrutamiento SPA y estado global del carrito de compras.

* **Backend & Database Developer:** Colaborador asignado *(o en equipo)*
  * Responsable de la arquitectura del servidor con Express/Node.js, modelado de esquemas y conexión a MongoDB Atlas, endpoints de la API REST y autenticación de usuarios.