import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/api/authSlice';
import { setCompany } from '@/api/companySlice';
import {
  useLazyGetCompanyByIdQuery,
  useLazyGetUserQuery,
} from '@/api/apiSlice';
import AuthError from './AuthError';
import LoaderGlobal from '@/components/Common/LoaderGlobal';

interface AuthInitializerProps {
  children: ReactNode;
}

// const ALLOWED_ROLES = ['SystemAdmin', 'Manager'];

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { isLoading, error, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const [fetchUser] = useLazyGetUserQuery();
  const [fetchCompany] = useLazyGetCompanyByIdQuery();
  const [userRoleValid, setUserRoleValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const init = async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));
        const user = await fetchUser().unwrap();
        if (user) {
          dispatch(setUser(user));

          // const role = Array.isArray(user.role) ? user.role : [user.role];
          // const isAllowed = role.some((r) => ALLOWED_ROLES.includes(String(r)));
          // setUserRoleValid(isAllowed);
          //if (!isAllowed) return;

          // quick fix for user access
          setUserRoleValid(true);

          if (user.companyId) {
            try {
              const company = await fetchCompany(user.companyId).unwrap();
              dispatch(setCompany(company));
              document.documentElement.style.setProperty(
                '--company-color',
                company.color || null
              );

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              if (err?.status === 403) {
                return;
              }
              throw err;
            }
          }
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

    init();
  }, [getAccessTokenSilently, fetchUser, fetchCompany, dispatch, isLoading]);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return <AuthError message={error.message} />;
  }

  if (userRoleValid === null) {
    return <LoaderGlobal />;
  }

  if (userRoleValid === false) {
    return (
      <AuthError
        message='Access denied'
        customMessage='You do not have permission to access this application. Please contact your Hird representative'
      />
    );
  }
  return <>{children}</>;
};

export default AuthInitializer;
