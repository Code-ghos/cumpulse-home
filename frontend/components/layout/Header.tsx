import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const active = (path: string) => (location.pathname === path ? "text-primary" : "text-foreground/70 hover:text-foreground");
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">CP</span>
          <span className="font-semibold tracking-tight">CalmPulse</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className={active("/")}>Home</Link>
          <Link to="/assessment" className={active("/assessment")}>Check‑In</Link>
          <Link to="/advice" className={active("/advice")}>Advice</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button asChild size="sm"><Link to="/login">Login</Link></Button>
          )}
        </div>
      </div>
    </header>
  );
}
