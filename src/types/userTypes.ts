export interface User {
  id: string;
  email: string;
  name: NameType;
  departmentId: string;
  companyId: string;
  role: string[];
}

export interface NameType {
  firstName: string;
  lastName: string;
}
