import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  return (
    <div>
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F2fb0ede0f64f42058be73805430a45c1%2Ff11ce7c6afca49bbb8ab6f0dfcd92505)" }}>
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[rgba(204,223,236,1)]">Digital Mental Health Support for Students</h1>
            <p className="mt-4 text-lg max-w-prose text-[rgba(197,199,131,1)]">MindCampus helps you check in with yourself, get personalized guidance, and find the right support on campus—confidentially and with care.</p>
            <div className="mt-6 flex gap-3">
              <Button asChild size="lg"><Link to="/assessment">Start your check‑in</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/login">Login</Link></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="h-36 md:h-40 bg-gradient-to-br from-primary/15 to-transparent">
              <CardContent className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl font-bold">Confidential</div>
                  <p className="text-sm text-muted-foreground">Your responses stay private</p>
                </div>
              </CardContent>
            </Card>
            <Card className="h-36 md:h-40">
              <CardContent className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl font-bold">Personal</div>
                  <p className="text-sm text-muted-foreground">Advice that adapts to you</p>
                </div>
              </CardContent>
            </Card>
            <Card className="h-36 md:h-40">
              <CardContent className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl font-bold">Supportive</div>
                  <p className="text-sm text-muted-foreground">Designed for student life</p>
                </div>
              </CardContent>
            </Card>
            <Card className="h-36 md:h-40">
              <CardContent className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl font-bold">Actionable</div>
                  <p className="text-sm text-muted-foreground">Steps you can take today</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F2fb0ede0f64f42058be73805430a45c1%2F6191e2e4bba746cd8d3ef1e85dcc2e43)" }}>
        <div className="container">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">How MindCampus helps</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Self‑reflection</h3>
              <p className="text-sm text-muted-foreground">Quick check‑ins make it easier to notice patterns and take care of yourself.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Personalized advice</h3>
              <p className="text-sm text-muted-foreground">Guidance adapts to your responses and evolves over time.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Campus resources</h3>
              <p className="text-sm text-muted-foreground">Helpful tips align with support options available to most students.</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg"><Link to="/assessment">Begin now</Link></Button>
        </div>
    </div>
      </section>

      <section className="border-t" style={{ backgroundColor: "rgba(242, 248, 248, 0.2)" }}>
        <div className="container py-14 grid md:grid-cols-2 gap-8 items-center bg-[rgba(252,247,254,1)]">
          <div>
            <h3 className="text-xl font-semibold">About us</h3>
            <p className="mt-2 text-sm text-muted-foreground">We are a student‑focused team committed to making mental health support more approachable and accessible. MindCampus is not a crisis service. If you are in immediate danger, contact local emergency services.</p>
          </div>
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              <p>“MindCampus gave me small, doable steps that actually fit my schedule.”</p>
              <p className="mt-2">— Student user</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
