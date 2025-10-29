export interface SurveyQuestion {
  questionText: string;
  questionSubtext: string;
  type: number;
  surveyOptions: string[];
  metricType: string[];
  metricKey: string[];
  tags?: string[];
  isSkippable?: boolean;
  prefix?: string;
  questionId?: string; // Unique ID for drag-and-drop functionality
}

export interface SurveyTypes {
  id: string;
  surveyId: string;
  companyId: string;
  departmentId: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  consentRequired?: boolean;
  surveyPublished?: boolean;
}
