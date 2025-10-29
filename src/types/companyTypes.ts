export interface Department {
  id?: string;
  name: string;
  dailyMetricsHistory?: metricHistory[];
  weeklyMetricsHistory?: metricHistory[];
}
export interface CreateDepartmentRequest {
  name: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  address?: string | null;
  supportEmail?: string;
  cvr?: string;
  departments: Department[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
  logoUrl?: string;
}

export interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  selectedDepartmentId: string | null;
  departments: Department[];
}

export interface metricHistory {
  id: string;
  date?: string;
  calmAverage: number;
  focusAverage: number;
  cognitiveEffortAverage: number;
  weekEnd?: string;
  weekStart?: string;
}

export interface CreateCompanyRequest {
  name: string;
  address: string | null;
  supportEmail: string;
  cvr: string;
  color: string;
  departments: CreateDepartmentRequest[];
}
export interface CreateCompanyResponse {
  companyId: string;
}

export interface SimplifiedCompany {
  id: string;
  name: string;
  logo: string;
  departments: Department[];
}

export type CompanyUpdatePayload = Omit<Company, 'id' | 'logo' | 'departments'>;
