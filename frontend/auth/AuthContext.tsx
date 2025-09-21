import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@shared/api";

interface AuthCtx {
  user: User | null;
  sessionId: string | null;
  loading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, sessionId: null, loading: true, login: async () => {}, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem("sessionId");
    if (s) setSessionId(s);
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/user", { headers: { "x-session-id": sessionId } });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem("sessionId");
          setSessionId(null);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [sessionId]);

  const login = async (email: string, name?: string) => {
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name }) });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("sessionId", data.sessionId);
    setSessionId(data.sessionId);
    setUser(data.user);
    navigate("/assessment");
  };

  const logout = async () => {
    if (sessionId) await fetch("/api/auth/logout", { method: "POST", headers: { "x-session-id": sessionId } });
    localStorage.removeItem("sessionId");
    setSessionId(null);
    setUser(null);
    navigate("/");
  };

  const value = useMemo(() => ({ user, sessionId, loading, login, logout }), [user, sessionId, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx) }
