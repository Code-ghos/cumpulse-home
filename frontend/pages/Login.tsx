import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, name);
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome to CalmPulse</h1>
        <p className="mt-3 text-muted-foreground">Log in with your email to save your check‑ins and receive personalized advice over time.</p>
      </div>
      <form onSubmit={onSubmit} className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" required className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Name (optional)</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1" />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </form>
    </section>
  );
}
