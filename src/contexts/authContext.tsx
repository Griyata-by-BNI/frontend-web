"use client";

import { AuthContextType, DecodedUser, JwtPayload } from "@/types/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";

type LogoutReason =
  | "manual"
  | "expired"
  | "idle"
  | "unauthenticated"
  | "invalid-token"
  | "forbidden"
  | "revoked"
  | "network";

type LogoutOptions = {
  redirect?: boolean; // default: true
  redirectTo?: string; // default: "/login"
  includeReturnTo?: boolean; // default: false (kalau true, tambahkan ?from=<path>)
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const bcRef = useRef<BroadcastChannel | null>(null);

  const buildLoginUrl = useCallback(
    (
      reason?: LogoutReason,
      includeReturnTo?: boolean,
      redirectTo = "/login"
    ) => {
      const params = new URLSearchParams();
      if (reason) params.set("reason", reason);
      if (includeReturnTo && pathname) params.set("from", pathname);
      return `${redirectTo}?${params.toString()}`;
    },
    [pathname]
  );

  const hardLogout = useCallback(() => {
    Cookies.remove("auth_token");
    localStorage.removeItem("kpr-apply-store");
    setUser(null);
    setToken(null);
    setHasLoggedOut(true);
  }, []);

  const logout = useCallback(
    (
      reason: LogoutReason = "manual",
      opts: LogoutOptions = {
        redirect: true,
        redirectTo: "/login",
        includeReturnTo: false,
      }
    ) => {
      // bersihkan sesi
      hardLogout();

      // broadcast ke tab lain agar ikut logout dengan reason yang sama
      bcRef.current?.postMessage({ type: "LOGOUT", reason });

      // redirect (default: true)
      if (opts.redirect !== false) {
        const url = buildLoginUrl(
          reason,
          !!opts.includeReturnTo,
          opts.redirectTo ?? "/login"
        );
        router.replace(url);
      }
    },
    [buildLoginUrl, hardLogout, router]
  );

  // Bootstrap sesi dari cookie
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        // jangan bootstrap jika sudah logout
        if (hasLoggedOut) {
          if (active) setLoading(false);
          return;
        }

        const savedToken = Cookies.get("auth_token");

        if (!savedToken) {
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(savedToken);
        const hasExp = typeof decoded.exp === "number";
        const isValid = hasExp ? decoded.exp * 1000 > Date.now() : false;

        if (!isValid) {
          logout("expired");
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
        logout("invalid-token");
      } finally {
        if (active) setLoading(false);
      }
    }

    // siapkan BroadcastChannel untuk sinkronisasi antar-tab
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel("auth");
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "LOGOUT") {
          // jangan redirect berulang-ulang; cukup follow satu kali
          hardLogout();
          const url = buildLoginUrl(
            (e.data?.reason as LogoutReason) ?? "manual",
            false,
            "/login"
          );
          router.replace(url);
        }
      };
    }

    bootstrap();

    return () => {
      active = false;
      bcRef.current?.close();
    };
  }, [buildLoginUrl, hardLogout, logout, router, hasLoggedOut]);

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
        setHasLoggedOut(false);
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
      } catch (err) {
        // sertakan reason saat gagal login
        logout("invalid-token");
        throw err;
      }
    },
    [logout, router]
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
