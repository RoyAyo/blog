import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication on app load
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/check', {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent
      });

      setIsAuthenticated(response.ok);
    } catch (err) {
      setIsAuthenticated(false);
      console.error(err);
    }
  };

  useEffect(() => {
    checkAuth(); // Check auth on mount
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
