import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import type { AdviceResponse } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Advice() {
  const { sessionId, loading } = useAuth();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);

  useEffect(() => {
    if (!loading && !sessionId) navigate("/login");
  }, [loading, sessionId, navigate]);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) return;
      const res = await fetch("/api/assessment/latest", { headers: { "x-session-id": sessionId } });
      if (res.ok) setAdvice(await res.json());
    };
    run();
  }, [sessionId]);

  if (!advice) return (
    <section className="container py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Your personalized advice</h1>
      <p className="text-muted-foreground mt-2">Complete a check‑in to see tailored guidance.</p>
    </section>
  );

  return (
    <section className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Your personalized advice</h1>
        <p className="text-muted-foreground mt-1">Based on your latest check‑in.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <div>Overall severity: <span className="font-medium text-foreground">{advice.summary.severity}</span></div>
            <div>Mood score: <span className="font-medium text-foreground">{advice.summary.moodScore}</span></div>
            <div>Anxiety score: <span className="font-medium text-foreground">{advice.summary.anxietyScore}</span></div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {advice.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
