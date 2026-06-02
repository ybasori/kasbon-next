"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (value: User|null)=>void;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);


  const logout = () => {
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}