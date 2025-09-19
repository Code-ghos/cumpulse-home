import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { AssessmentRecord, AssessmentQuestion, AssessmentSummary, User } from "@shared/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

interface DBSession { userId: string; createdAt: string }
interface DBUser extends User { assessments: AssessmentRecord[] }
interface DBShape { users: Record<string, DBUser>; sessions: Record<string, DBSession> }

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: DBShape = { users: {}, sessions: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

function readDB(): DBShape {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DBShape;
}

function writeDB(db: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function getOrCreateUserByEmail(email: string, name?: string): DBUser {
  const db = readDB();
  let user = Object.values(db.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const id = uuidv4();
    user = { id, email, name, createdAt: new Date().toISOString(), assessments: [] };
    db.users[id] = user;
    writeDB(db);
  } else if (name && !user.name) {
    user.name = name;
    writeDB(db);
  }
  return user;
}

export function createSession(userId: string): string {
  const db = readDB();
  const sessionId = uuidv4();
  db.sessions[sessionId] = { userId, createdAt: new Date().toISOString() };
  writeDB(db);
  return sessionId;
}

export function getUserBySession(sessionId?: string): DBUser | null {
  if (!sessionId) return null;
  const db = readDB();
  const sess = db.sessions[sessionId];
  if (!sess) return null;
  return db.users[sess.userId] ?? null;
}

export function logoutSession(sessionId?: string) {
  if (!sessionId) return;
  const db = readDB();
  if (db.sessions[sessionId]) {
    delete db.sessions[sessionId];
    writeDB(db);
  }
}

export function addAssessment(userId: string, record: AssessmentRecord) {
  const db = readDB();
  const user = db.users[userId];
  if (!user) throw new Error("User not found");
  user.assessments.push(record);
  writeDB(db);
}

export function getLatestAssessment(userId: string): AssessmentRecord | null {
  const db = readDB();
  const user = db.users[userId];
  if (!user || user.assessments.length === 0) return null;
  return user.assessments[user.assessments.length - 1];
}

// Question bank and personalization
const BASE_SCALE_LABELS = ["Never", "Rarely", "Sometimes", "Often", "Always"];

const BASE_QUESTIONS: { id: string; text: string; domain: "mood" | "anxiety" }[] = [
  { id: "m1", text: "Over the past week, how often have you felt down or hopeless?", domain: "mood" },
  { id: "m2", text: "How often have you had trouble enjoying activities you usually like?", domain: "mood" },
  { id: "a1", text: "How often have you felt nervous, anxious, or on edge?", domain: "anxiety" },
  { id: "a2", text: "How often have you found it hard to relax?", domain: "anxiety" },
];

const FOLLOW_UP_ANXIETY = [
  { id: "a3", text: "How often have you experienced racing thoughts?", domain: "anxiety" },
  { id: "a4", text: "How often do worries interfere with your studies?", domain: "anxiety" },
];

const FOLLOW_UP_MOOD = [
  { id: "m3", text: "How often have you felt tired or had little energy?", domain: "mood" },
  { id: "m4", text: "How often have you had changes in sleep?", domain: "mood" },
];

export function getQuestionsForUser(user?: DBUser | null): AssessmentQuestion[] {
  const latest = user ? getLatestAssessment(user.id) : null;
  const base: AssessmentQuestion[] = BASE_QUESTIONS.map((q) => ({ id: q.id, text: q.text, type: "scale", min: 1, max: 5, labels: BASE_SCALE_LABELS }));
  if (!latest) return base;
  const { anxietyScore, moodScore } = latest.summary;
  const extra: AssessmentQuestion[] = [];
  if (anxietyScore >= 3) {
    extra.push(...FOLLOW_UP_ANXIETY.map((q) => ({ id: q.id, text: q.text, type: "scale", min: 1, max: 5, labels: BASE_SCALE_LABELS })));
  }
  if (moodScore >= 3) {
    extra.push(...FOLLOW_UP_MOOD.map((q) => ({ id: q.id, text: q.text, type: "scale", min: 1, max: 5, labels: BASE_SCALE_LABELS })));
  }
  return [...base, ...extra];
}

export function summarizeAnswers(answers: { questionId: string; value: number | string }[]): AssessmentSummary {
  // Map domains
  const domain: Record<string, "mood" | "anxiety"> = { m1: "mood", m2: "mood", m3: "mood", m4: "mood", a1: "anxiety", a2: "anxiety", a3: "anxiety", a4: "anxiety" };
  let moodVals: number[] = [];
  let anxVals: number[] = [];
  for (const a of answers) {
    const v = typeof a.value === "number" ? a.value : parseInt(String(a.value)) || 0;
    if (domain[a.questionId] === "mood") moodVals.push(v);
    if (domain[a.questionId] === "anxiety") anxVals.push(v);
  }
  const moodScore = moodVals.length ? round1(avg(moodVals)) : 0;
  const anxietyScore = anxVals.length ? round1(avg(anxVals)) : 0;
  const severity = moodScore >= 4 || anxietyScore >= 4 ? "high" : moodScore >= 3 || anxietyScore >= 3 ? "moderate" : "low";
  return { moodScore, anxietyScore, severity };
}

function avg(arr: number[]) { return arr.reduce((a, b) => a + b, 0) / arr.length }
function round1(n: number) { return Math.round(n * 10) / 10 }

export function adviceForSummary(summary: AssessmentSummary): string[] {
  const recs: string[] = [];
  if (summary.severity === "low") {
    recs.push(
      "Keep up healthy habits: regular sleep, movement, and time with friends.",
      "Try a 5-minute breathing exercise during study breaks.",
      "Use campus wellness resources when needed."
    );
  }
  if (summary.severity === "moderate") {
    recs.push(
      "Schedule a brief check-in with a counselor or peer support.",
      "Use guided journaling to track triggers and moods.",
      "Practice the 3-3-3 grounding technique during stress."
    );
  }
  if (summary.severity === "high") {
    recs.push(
      "Consider contacting campus counseling for a professional evaluation.",
      "Create a support plan with trusted friends or mentors.",
      "If in crisis, call local emergency services or a crisis hotline immediately."
    );
  }
  if (summary.anxietyScore >= 3.5) recs.push("Try short, daily mindfulness sessions (5–10 min).");
  if (summary.moodScore >= 3.5) recs.push("Plan small, enjoyable activities each day to boost mood.");
  return recs;
}
