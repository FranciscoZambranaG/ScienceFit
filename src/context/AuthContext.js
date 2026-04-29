import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase.config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'Usuario autenticado' : 'No hay usuario');

      if (currentUser) {
        console.log('UID del usuario:', currentUser.uid);
        console.log('Email:', currentUser.email);

        try {
          const userDoc = await db.collection('users').doc(currentUser.uid).get();
          console.log('Documento existe:', userDoc.exists);

          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('Datos del usuario:', userData);
            console.log('Role:', userData.role);
            console.log('Onboarding completado:', userData.onboardingCompleted);

            const userWithData = {
              uid: currentUser.uid,
              email: currentUser.email,
              ...userData,
              onboardingCompleted: userData.onboardingCompleted || false
            };

            setUser(userWithData);
            setUserRole(userData.role);

            if (userData.role === 'usuario') {
              setOnboardingCompleted(userData.onboardingCompleted || false);
            } else {
              setOnboardingCompleted(true);
            }
          } else {
            console.log('Documento no existe, creando uno nuevo...');
            await db.collection('users').doc(currentUser.uid).set({
              email: currentUser.email,
              role: 'usuario',
              name: currentUser.email.split('@')[0],
              createdAt: new Date().toISOString(),
              onboardingCompleted: false,
            });

            const userWithData = {
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'usuario',
              name: currentUser.email.split('@')[0],
              onboardingCompleted: false
            };

            setUser(userWithData);
            setUserRole('usuario');
            setOnboardingCompleted(false);
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            onboardingCompleted: true
          });
          setUserRole('usuario');
          setOnboardingCompleted(true);
        }
      } else {
        console.log('No hay usuario autenticado');
        setUser(null);
        setUserRole(null);
        setOnboardingCompleted(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, role, userData) => {
    try {
      console.log('Registrando usuario:', email, 'con role:', role);
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('Usuario creado en Auth con UID:', user.uid);

      await db.collection('users').doc(user.uid).set({
        email,
        role,
        ...userData,
        createdAt: new Date().toISOString(),
        onboardingCompleted: role !== 'usuario',
      });

      console.log('Documento creado en Firestore');

      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al crear la cuenta';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de red. Verifica tu conexión a internet';
      }

      console.error('Error en registro:', error);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Intentando iniciar sesión con:', email);
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Login exitoso');
      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Intenta más tarde';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de red. Verifica tu conexión a internet';
      }

      console.error('Error en login:', error.code, error.message);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      console.log('Cerrando sesión...');
      await auth.signOut();
      console.log('Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  };

  const completeOnboarding = async () => {
    try {
      if (!user || !user.uid) {
        console.error('No hay usuario autenticado');
        return { success: false, error: 'No hay usuario autenticado' };
      }

      console.log('Completando onboarding para usuario:', user.uid);

      await db.collection('users').doc(user.uid).set({
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setUser({
        ...user,
        onboardingCompleted: true
      });
      setOnboardingCompleted(true);

      console.log('Onboarding completado exitosamente');
      return { success: true };
    } catch (error) {
      console.error('Error completando onboarding:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        onboardingCompleted,
        register,
        login,
        logout,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
