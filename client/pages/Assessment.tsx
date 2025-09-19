import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { AssessmentAnswer, AssessmentQuestion } from "@shared/api";

export default function Assessment() {
  const { sessionId, loading, user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !sessionId) navigate("/login");
  }, [loading, sessionId, navigate]);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) return;
      const res = await fetch("/api/assessment/questions", { headers: { "x-session-id": sessionId } });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    };
    run();
  }, [sessionId]);

  const allAnswered = useMemo(() => questions.length > 0 && questions.every((q) => answers[q.id] !== undefined), [questions, answers]);

  const onChange = (qid: string, value: number | string) => setAnswers((a) => ({ ...a, [qid]: value }));

  const onSubmit = async () => {
    if (!sessionId) return;
    setSubmitting(true);
    const payload = { answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })) } as { answers: AssessmentAnswer[] };
    const res = await fetch("/api/assessment/submit", { method: "POST", headers: { "Content-Type": "application/json", "x-session-id": sessionId }, body: JSON.stringify(payload) });
    setSubmitting(false);
    if (res.ok) navigate("/advice");
  };

  return (
    <section className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Your Mental Health Check‑In</h1>
        <p className="text-muted-foreground mt-1">Answer a few quick questions. Your responses are private and help tailor guidance for you{user?.name ? `, ${user.name}` : ""}.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((q) => (
          <Card key={q.id} className="border-primary/20 hover:border-primary/60 transition-colors">
            <CardHeader>
              <CardTitle className="text-base leading-snug">{q.text}</CardTitle>
            </CardHeader>
            <CardContent>
              {q.type === "scale" && (
                <RadioGroup value={String(answers[q.id] ?? "")} onValueChange={(v) => onChange(q.id, parseInt(v))} className="grid grid-cols-5 gap-2">
                  {(q.labels ?? ["1","2","3","4","5"]).map((label, idx) => {
                    const val = (q.min ?? 1) + idx;
                    return (
                      <div key={val} className="flex flex-col items-center gap-1">
                        <RadioGroupItem id={`${q.id}-${val}`} value={String(val)} />
                        <Label htmlFor={`${q.id}-${val}`} className="text-xs text-muted-foreground">{label}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button size="lg" disabled={!allAnswered || submitting} onClick={onSubmit}>{submitting ? "Submitting..." : "See my advice"}</Button>
      </div>
    </section>
  );
}
