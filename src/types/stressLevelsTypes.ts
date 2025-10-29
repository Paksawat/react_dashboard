export interface StressLevel {
  date: string;
  optimal: number;
  balanced: number;
  moderate: number;
  unfavorable: number;
}

export interface DepartmentStressLevels {
  departmentId: string;
  departmentName: string;
  start: string;
  end: string;
  stressLevels: StressLevel[];
}
