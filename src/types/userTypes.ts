export interface User {
  id: string;
  email: string;
  name: string;
  departmentId: string;
  companyId: string;
  role: string[];
}

export interface NameType {
  firstName: string;
  lastName: string;
}
