export interface Metric {
  departmentId: string;
  departmentName: string;
  start: string;
  end: string;
  data: MetricsData[];
}

export interface MetricsData {
  focus: number;
  calm: number;
  cognitiveEffort: number;
}

export interface AvgMetricsType {
  id: string;
  date: string;
  focusAverage: number;
  calmAverage: number;
  cognitiveEffortAverage: number;
}

export interface MentalHealthContributor {
  id: string;
  name: string;
  impact: number;
  category: string;
  description?: string;
}

export interface MentalHealthContributorsResponse {
  confidence: number;
  energy: number;
  mood: number;
  workload: number;
  lastUpdated?: string;
}

export interface WellbeingIndexData {
  overallScore: number;
  mentalHealthScore: number;
  workLifeBalanceScore: number;
  stressLevelScore: number;
  satisfactionScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface WellbeingIndexResponse {
  //departmentId: string;
  // departmentName: string;
  //wellbeingIndex: WellbeingIndexData;
  // historicalData: {
  //   date: string;
  //   score: number;
  // }[];
  score: number;
}

export interface ENPSResponse {
  promoters: number;
  passives: number;
  detractors: number;
  score: number;
}

export interface LifeSatisfactionResponse {
  score: number;
}
