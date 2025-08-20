"use client";

import { AuthContextType, DecodedUser, JwtPayload } from "@/types/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Spin } from "antd";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = Cookies.get("auth_token");

        if (savedToken) {
          const decoded = jwtDecode<JwtPayload>(savedToken);

        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            fullName: decoded.fullName,
            role: decoded.role,
          });
        } else {
          Cookies.remove("auth_token");
        }
      } catch {
        Cookies.remove("auth_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    const { userId, email, fullName, role } = jwtDecode<JwtPayload>(token);
    setUser({
      userId,
      email,
      fullName,
      role,
    });
    setToken(token);
    Cookies.set("auth_token", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (role === "user") {
      router.push("/");
    }

    if (role === "admin") {
      router.push("/admin/developer-management");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("auth_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};