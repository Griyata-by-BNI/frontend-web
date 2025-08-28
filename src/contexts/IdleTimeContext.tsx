"use client";

import { useIdleTimer } from "react-idle-timer";
import { createContext, useContext, useEffect, useRef, ReactNode } from "react";

interface IdleTimeContextType {
  getRemainingTime: () => number;
}

const IdleTimeContext = createContext<IdleTimeContextType | null>(null);

interface IdleTimeProviderProps {
  children: ReactNode;
  timeoutMs?: number;
  onIdle: () => void;
  debug?: boolean;
  active?: boolean;
}

export function IdleTimeProvider({
  children,
  timeoutMs = 120_000,
  onIdle,
  debug = false,
  active = true, // default true
}: IdleTimeProviderProps) {
  const bcRef = useRef<BroadcastChannel | null>(null);
  const loggedOutRef = useRef(false);

  const handleIdle = () => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;
    bcRef.current?.postMessage({ type: "LOGOUT" });
    onIdle();
  };

  // Kalau active = false, kita pakai dummy function
  const { getRemainingTime } = useIdleTimer({
    timeout: timeoutMs,
    onIdle: handleIdle,
    debounce: 500,
    crossTab: true,
    disabled: !active, // 🔥 built-in option dari react-idle-timer
  });

  useEffect(() => {
    loggedOutRef.current = false;

    if (!active) return; // 🔥 skip kalau tidak aktif

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel("auth");
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "LOGOUT" && !loggedOutRef.current) {
          loggedOutRef.current = true;
          onIdle();
        }
      };
    }

    if (debug) {
      const interval = setInterval(() => {
        if (!loggedOutRef.current) {
          const remaining = Math.floor(getRemainingTime() / 1000);
          console.log(`[IdleDebug] Sisa ${remaining}s sebelum logout`);
        }
      }, 5000);
      return () => clearInterval(interval);
    }

    return () => {
      bcRef.current?.close();
    };
  }, [debug, getRemainingTime, onIdle, active]);

  return (
    <IdleTimeContext.Provider value={{ getRemainingTime }}>
      {children}
    </IdleTimeContext.Provider>
  );
}

export function useIdleTime() {
  const context = useContext(IdleTimeContext);
  if (!context) {
    throw new Error("useIdleTime must be used within IdleTimeProvider");
  }
  return context;
}
