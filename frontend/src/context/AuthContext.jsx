import { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../services/authService';

// Creación del Contexto global de Autenticación
export const AuthContext = createContext();

// Proveedor de Autenticación (AuthProvider): gestiona la sesión con la API REST y soporte offline
export const AuthProvider = ({ children }) => {
  // Estado del usuario activo, recuperado de localStorage para persistir la sesión tras recargar
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nordic_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Lista simulada de usuarios registrados guardada localmente (fallback para desarrollo offline)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const savedList = localStorage.getItem('nordic_registered_users');
      return savedList ? JSON.parse(savedList) : [];
    } catch {
      return [];
    }
  });

  // Sincroniza la sesión activa del usuario con localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nordic_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nordic_user');
      }
    } catch (e) {
      console.error('Error al persistir usuario en localStorage:', e);
    }
  }, [user]);

  // Sincroniza la lista de usuarios registrados locales con localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nordic_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error al persistir usuarios registrados:', e);
    }
  }, [registeredUsers]);

  // Inicia sesión: intenta autenticar con el Backend Express; si está apagado, usa el fallback local
  const login = async (email, password) => {
    const emailNormalizado = email.trim().toLowerCase();

    // 1. Intentar iniciar sesión en el servidor Express con Axios
    const apiRes = await loginRequest(emailNormalizado, password);

    // Si el backend respondió exitosamente con el token JWT
    if (apiRes.success && apiRes.user) {
      const sesion = {
        ...apiRes.user,
        token: apiRes.token,
      };
      setUser(sesion);
      return { success: true, user: sesion };
    }

    // Si el backend respondió con un error de credenciales legítimo (no de red)
    if (!apiRes.networkError && apiRes.message) {
      return { success: false, message: apiRes.message };
    }

    // 2. Fallback de desarrollo offline (mientras el backend de tu compañero está en construcción)
    console.info('[Auth] Backend no disponible, validando con sesión local de desarrollo.');
    const usuarioEncontrado = registeredUsers.find(
      (u) => u.email.toLowerCase() === emailNormalizado
    );

    if (!usuarioEncontrado) {
      const usuarioDemo = {
        id: Date.now(),
        nombre: emailNormalizado.split('@')[0],
        email: emailNormalizado,
        fechaRegistro: new Date().toLocaleDateString('es-MX'),
        token: 'demo_jwt_token_local',
      };
      setUser(usuarioDemo);
      return { success: true, user: usuarioDemo };
    }

    if (usuarioEncontrado.password !== password) {
      return { success: false, message: 'La contraseña ingresada es incorrecta.' };
    }

    const sesionUsuario = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      email: usuarioEncontrado.email,
      telefono: usuarioEncontrado.telefono || '',
      fechaRegistro: usuarioEncontrado.fechaRegistro || new Date().toLocaleDateString('es-MX'),
      token: 'demo_jwt_token_local',
    };

    setUser(sesionUsuario);
    return { success: true, user: sesionUsuario };
  };

  // Registra un nuevo usuario en la API de Express (o fallback local si el backend está offline)
  const register = async (datos) => {
    const emailNormalizado = datos.email.trim().toLowerCase();

    // 1. Intentar registrar en el servidor Express con Axios
    const apiRes = await registerRequest(datos);

    if (apiRes.success && apiRes.user) {
      const sesion = {
        ...apiRes.user,
        token: apiRes.token,
      };
      setUser(sesion);
      return { success: true, user: sesion };
    }

    if (!apiRes.networkError && apiRes.message) {
      return { success: false, message: apiRes.message };
    }

    // 2. Fallback local de desarrollo
    console.info('[Auth] Backend no disponible, registrando en almacenamiento local de desarrollo.');
    const existe = registeredUsers.some(
      (u) => u.email.toLowerCase() === emailNormalizado
    );

    if (existe) {
      return { success: false, message: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: datos.nombre.trim(),
      email: emailNormalizado,
      telefono: datos.telefono ? datos.telefono.trim() : '',
      password: datos.password,
      fechaRegistro: new Date().toLocaleDateString('es-MX'),
    };

    setRegisteredUsers((prev) => [...prev, nuevoUsuario]);

    const sesionUsuario = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      telefono: nuevoUsuario.telefono,
      fechaRegistro: nuevoUsuario.fechaRegistro,
      token: 'demo_jwt_token_local',
    };
    setUser(sesionUsuario);

    return { success: true, user: sesionUsuario };
  };

  // Cierra la sesión activa del usuario
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
