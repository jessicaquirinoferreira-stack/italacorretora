import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isInitialPassword: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAdminPassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isInitialPassword: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  updateAdminPassword: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitialPassword, setIsInitialPassword] = useState<boolean>(false);

  useEffect(() => {
    // Check local session state
    const savedAdmin = localStorage.getItem('ittala_admin_session');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
      if (localStorage.getItem('ittala_initial_pass') === 'true') {
        setIsInitialPassword(true);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsAdmin(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Check initial credentials requested by prompt (admin@x.com / admin4321)
    const normalizedEmail = email.trim().toLowerCase();
    const storedCustomPass = localStorage.getItem('ittala_custom_admin_pass');
    const validPass = storedCustomPass || 'admin4321';

    if (normalizedEmail === 'admin@x.com' && pass === validPass) {
      setIsAdmin(true);
      localStorage.setItem('ittala_admin_session', 'true');
      if (!storedCustomPass && pass === 'admin4321') {
        setIsInitialPassword(true);
        localStorage.setItem('ittala_initial_pass', 'true');
      } else {
        setIsInitialPassword(false);
        localStorage.removeItem('ittala_initial_pass');
      }
      return { success: true };
    }

    // Attempt Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setUser(cred.user);
      setIsAdmin(true);
      localStorage.setItem('ittala_admin_session', 'true');
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Credenciais inválidas. Verifique e tente novamente.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    setUser(null);
    setIsAdmin(false);
    setIsInitialPassword(false);
    localStorage.removeItem('ittala_admin_session');
    localStorage.removeItem('ittala_initial_pass');
  };

  const updateAdminPassword = async (newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (newPass.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    if (user) {
      try {
        await updatePassword(user, newPass);
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar senha no Firebase' };
      }
    }

    // Persist securely in local admin configuration
    localStorage.setItem('ittala_custom_admin_pass', newPass);
    localStorage.removeItem('ittala_initial_pass');
    setIsInitialPassword(false);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isInitialPassword,
        login,
        logout,
        updateAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
