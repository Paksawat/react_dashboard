import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/api/authSlice';
import { setCompany } from '@/api/companySlice';
import AuthError from './AuthError';
import LoaderGlobal from '@/components/Common/LoaderGlobal';
import data from '@/data.json';

interface AuthInitializerProps {
  children: ReactNode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  departmentId: string;
  role: string[];
}
export interface Department {
  id: string;
  name: string;
  enps: {
    detractors: number;
    passives: number;
    promoters: number;
    score: number;
  };
  health_contributors: {
    energy: number;
    workload: number;
    confidence: number;
    mood: number;
  };
  life_satisfactory: {
    score: number;
  };
  metrics: {
    calm: number;
    cognitiveEffort: number;
    focus: number;
  };
  wellbeing: {
    score: number;
  };
}

export interface Company {
  id: string;
  companyColor: string;
  departments: Department[];
  name: string;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userRoleValid, setUserRoleValid] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const mockToken: string = 'mock-local-token';
        const mockUser: User = {
          id: 'mock-user-id',
          name: 'Local Developer',
          email: 'dev@example.com',
          companyId: '22c81ebd-993f-471f-acfc-1b4079ee743b',
          departmentId: '001-001',
          role: ['Manager'],
        };

        dispatch(setToken(mockToken));
        dispatch(setUser(mockUser));
        setUserRoleValid(true);

        const company: Company = data['Tech Firm'][0];
        if (company) {
          dispatch(setCompany(company));
          document.documentElement.style.setProperty(
            '--company-color',
            company.companyColor || '#39D6B9'
          );
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUserRoleValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [dispatch]);

  if (isLoading) {
    return <LoaderGlobal />;
  }

  if (userRoleValid === false) {
    return (
      <AuthError
        message="Access denied"
        customMessage="You do not have permission to access this application. Please contact your Hird representative."
      />
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
