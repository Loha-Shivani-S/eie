import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Hardcoded admin credentials
const ADMINS: Record<string, { password: string; name: string; id: string }> = {
  "lohashivanis.24eie@kongu.edu": {
    password: "loha@123",
    name: "Loha Shivanis",
    id: "11111111-1111-1111-1111-111111111111",
  },
  "rishikeshwaranm.23eie@kongu.edu": {
    password: "Rishi@3106",
    name: "Rishikeshwaran",
    id: "22222222-2222-2222-2222-222222222222",
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pure memory auth: do not load anything from storage
    // User is forced to login on every page load/refresh
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const admin = ADMINS[email.toLowerCase().trim()];
    
    if (admin && admin.password === password) {
      const mockUser = {
        id: admin.id,
        email: email.toLowerCase().trim(),
        app_metadata: {},
        user_metadata: { name: admin.name },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      const mockSession: Session = {
        user: mockUser,
        access_token: "mock-token",
        refresh_token: "mock-refresh",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
      };

      setUser(mockUser);
      setSession(mockSession);
      setIsAdmin(true);
      
      return { error: null };
    }
    
    return { error: "Invalid email or password. Access denied." };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
