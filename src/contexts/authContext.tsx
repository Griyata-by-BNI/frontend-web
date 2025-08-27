"use client";

import { AuthContextType, DecodedUser, JwtPayload } from "@/types/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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

  const hardLogout = useCallback(() => {
    Cookies.remove("auth_token");
    localStorage.removeItem("kpr-apply-form");
    setUser(null);
    setToken(null);
  }, []);

  const logout = useCallback(() => {
    hardLogout();
    router.replace("/login");
  }, [hardLogout, router]);

  useEffect(() => {
    let active = true;

    const bootstrap = () => {
      try {
        const savedToken = Cookies.get("auth_token");
        if (!savedToken) return;

        const decoded = jwtDecode<JwtPayload>(savedToken);
        const hasExp = typeof decoded.exp === "number";
        const isValid = hasExp ? decoded.exp * 1000 > Date.now() : false;

        if (!isValid) {
          hardLogout();
          router.replace("/login");
          return;
        }

        if (active) {
          setToken(savedToken);
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            fullName: decoded.fullName,
            role: decoded.role,
          });
        }
      } catch {
        hardLogout();
        router.replace("/login");
      }
    };

    bootstrap();
    setLoading(false);

    return () => {
      active = false;
    };
  }, [hardLogout, router]);

  const login = useCallback(
    (newToken: string) => {
      try {
        const { userId, email, fullName, role, exp } =
          jwtDecode<JwtPayload>(newToken);

        if (typeof exp === "number" && exp * 1000 <= Date.now()) {
          throw new Error("Token expired");
        }

        setUser({ userId, email, fullName, role });
        setToken(newToken);
        Cookies.set("auth_token", newToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        if (role === "DEBTOR") {
          router.push("/");
        } else {
          throw new Error("Invalid role");
        }
      } catch {
        hardLogout();
        router.replace("/login");
      }
    },
    [hardLogout, router]
  );

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
