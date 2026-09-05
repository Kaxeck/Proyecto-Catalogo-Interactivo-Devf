import { createContext, useState, useEffect } from 'react';

// Creación del Contexto global de Autenticación
export const AuthContext = createContext();

// Proveedor de Autenticación (AuthProvider): suministra estado de usuario y métodos de autenticación
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

  // Lista simulada de usuarios registrados guardada localmente
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

  // Sincroniza la lista de usuarios registrados con localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nordic_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error al persistir usuarios registrados:', e);
    }
  }, [registeredUsers]);

  // Inicia sesión verificando credenciales con la lista local de usuarios registrados
  const login = (email, password) => {
    const emailNormalizado = email.trim().toLowerCase();
    const usuarioEncontrado = registeredUsers.find(
      (u) => u.email.toLowerCase() === emailNormalizado
    );

    // Validación: usuario no registrado previamente en la lista
    if (!usuarioEncontrado) {
      // Para efectos de prueba demostrativa fluida, crea y conecta la cuenta
      const usuarioDemo = {
        id: Date.now(),
        nombre: emailNormalizado.split('@')[0],
        email: emailNormalizado,
        fechaRegistro: new Date().toLocaleDateString('es-MX'),
      };
      setUser(usuarioDemo);
      return { success: true, user: usuarioDemo };
    }

    // Validación: contraseña incorrecta
    if (usuarioEncontrado.password !== password) {
      return { success: false, message: 'La contraseña ingresada es incorrecta.' };
    }

    // Inicio de sesión exitoso
    const sesionUsuario = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      email: usuarioEncontrado.email,
      telefono: usuarioEncontrado.telefono || '',
      fechaRegistro: usuarioEncontrado.fechaRegistro || new Date().toLocaleDateString('es-MX'),
    };

    setUser(sesionUsuario);
    return { success: true, user: sesionUsuario };
  };

  // Registra un nuevo usuario en la lista persistente e inicia su sesión de forma automática
  const register = (datos) => {
    const emailNormalizado = datos.email.trim().toLowerCase();
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

    // Establece la sesión activa del usuario recién registrado
    const sesionUsuario = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      telefono: nuevoUsuario.telefono,
      fechaRegistro: nuevoUsuario.fechaRegistro,
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
