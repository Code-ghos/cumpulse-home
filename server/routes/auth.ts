import { RequestHandler } from "express";
import { createSession, getOrCreateUserByEmail, getUserBySession, logoutSession } from "../db";
import { SessionResponse, UserResponse } from "@shared/api";

export const handleLogin: RequestHandler = (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  const user = getOrCreateUserByEmail(email, name);
  const sessionId = createSession(user.id);
  const response: SessionResponse = { sessionId, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } };
  res.json(response);
};

export const handleGetUser: RequestHandler = (req, res) => {
  const sessionId = req.header("x-session-id") ?? undefined;
  const user = getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const response: UserResponse = { user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } };
  res.json(response);
};

export const handleLogout: RequestHandler = (req, res) => {
  const sessionId = req.header("x-session-id") ?? req.body?.sessionId;
  if (!sessionId) return res.status(400).json({ error: "Missing session" });
  logoutSession(sessionId);
  res.json({ ok: true });
};
