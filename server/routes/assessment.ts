import { RequestHandler } from "express";
import { addAssessment, adviceForSummary, getQuestionsForUser, getUserBySession, getLatestAssessment, summarizeAnswers } from "../db";
import { AdviceResponse, GetQuestionsResponse, SubmitAssessmentRequest, SubmitAssessmentResponse } from "@shared/api";
import { v4 as uuidv4 } from "uuid";

function requireUser(req: any) {
  const sessionId = req.header("x-session-id") as string | undefined;
  const user = getUserBySession(sessionId);
  return { user, sessionId } as const;
}

export const handleGetQuestions: RequestHandler = (req, res) => {
  const { user } = requireUser(req);
  const questions = getQuestionsForUser(user);
  const response: GetQuestionsResponse = { questions };
  res.json(response);
};

export const handleSubmitAssessment: RequestHandler = (req, res) => {
  const { user } = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const body = req.body as SubmitAssessmentRequest;
  if (!body?.answers || !Array.isArray(body.answers)) return res.status(400).json({ error: "Invalid answers" });

  const summary = summarizeAnswers(body.answers as any);
  const recordId = uuidv4();
  const record = {
    id: recordId,
    userId: user.id,
    answers: body.answers,
    summary,
    createdAt: new Date().toISOString(),
  };
  addAssessment(user.id, record);
  const response: SubmitAssessmentResponse = { recordId, advice: { summary, recommendations: adviceForSummary(summary) } };
  res.json(response);
};

export const handleLatestAssessment: RequestHandler = (req, res) => {
  const { user } = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const latest = getLatestAssessment(user.id);
  if (!latest) return res.json(null);
  const response: AdviceResponse = { summary: latest.summary, recommendations: adviceForSummary(latest.summary) };
  res.json(response);
};
