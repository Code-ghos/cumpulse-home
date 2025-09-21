import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetUser, handleLogin, handleLogout } from "./routes/auth";
import { handleGetQuestions, handleLatestAssessment, handleSubmitAssessment } from "./routes/assessment";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/login", handleLogin);
  app.get("/api/user", handleGetUser);
  app.post("/api/auth/logout", handleLogout);

  // Assessment
  app.get("/api/assessment/questions", handleGetQuestions);
  app.post("/api/assessment/submit", handleSubmitAssessment);
  app.get("/api/assessment/latest", handleLatestAssessment);

  return app;
}
