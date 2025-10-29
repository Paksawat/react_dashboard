import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoaderGlobal from './LoaderGlobal';
import AuthError from '../../auth/AuthError';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loginWithRedirect, isLoading, error } = useAuth0();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !error) {
        loginWithRedirect({
          appState: { returnTo: location.pathname + location.search },
        });
      } else {
        setAuthChecked(true);
      }
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect]);

  if (isLoading || (!isAuthenticated && !error && !authChecked)) {
    return (
      <div>
        <LoaderGlobal text='Loading your dashboard...' />
      </div>
    );
  }

  if (error) {
    const isUnauthorizedDomain =
      error.message?.toLowerCase().includes('unauthorized') ||
      error.message?.toLowerCase().includes('not allowed');

    const customMessage = isUnauthorizedDomain
      ? "It looks like you're trying to log in from an unauthorized domain or email address. Please ensure you're using an approved account and company email."
      : undefined;

    return <AuthError message={error.message} customMessage={customMessage} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
