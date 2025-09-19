export interface DemoResponse { message: string }

export type Severity = "low" | "moderate" | "high";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface SessionResponse {
  sessionId: string;
  user: User;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "scale" | "choice";
  min?: number;
  max?: number;
  labels?: string[];
}

export interface AssessmentAnswer {
  questionId: string;
  value: number | string;
}

export interface AssessmentSummary {
  moodScore: number;
  anxietyScore: number;
  severity: Severity;
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  answers: AssessmentAnswer[];
  summary: AssessmentSummary;
  createdAt: string;
}

export interface GetQuestionsResponse {
  questions: AssessmentQuestion[];
}

export interface SubmitAssessmentRequest {
  answers: AssessmentAnswer[];
}

export interface SubmitAssessmentResponse {
  recordId: string;
  advice: AdviceResponse;
}

export interface AdviceResponse {
  summary: AssessmentSummary;
  recommendations: string[];
}

export interface UserResponse {
  user: User;
}
