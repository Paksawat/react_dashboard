export interface WellbeingIndex {
  id: number;
  user_id: number;
  percentage: number;
  percentage_change: number;
}

export interface EmployerNPS {
  label: string;
  value: number;
}
export interface LifeSatisfactory {
  label: string;
  value: number;
}

export interface Summary {
  id: number;
  user_id: number;
  text: string;
  advice: string;
}

export interface CompanyData {
  company_id: string;
  wellbeing_index: WellbeingIndex[];
  employer_nps: EmployerNPS[];
  life_satisfactory: LifeSatisfactory[];
  summary: Summary[];
}

export interface Data {
  hird: CompanyData[];
  testCompany: CompanyData[];
}
