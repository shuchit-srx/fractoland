import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "builder" | "agent" | "owner";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for each role
const dummyUsers: Record<UserRole, User> = {
  user: {
    id: "1",
    name: "John User",
    email: "user@fractoland.com",
    role: "user",
  },
  builder: {
    id: "2",
    name: "Sarah Builder",
    email: "builder@fractoland.com",
    role: "builder",
  },
  agent: {
    id: "3",
    name: "Mike Agent",
    email: "agent@fractoland.com",
    role: "agent",
  },
  owner: {
    id: "4",
    name: "Lena Landowner",
    email: "owner@fractoland.com",
    role: "owner",
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("fractoland_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Dummy validation - accept any email/password
    const loggedInUser = dummyUsers[role];
    const userData = { ...loggedInUser, email };
    
    // Set localStorage first, then state
    localStorage.setItem("fractoland_user", JSON.stringify(userData));
    setUser(userData);
    
    // Ensure state is updated
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 0);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fractoland_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
