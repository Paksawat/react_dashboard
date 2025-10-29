import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthErrorProps {
  message: string;
  customMessage?: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ message, customMessage }) => {
  const { logout } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4 px-4">
      <h1 className="text-2xl font-semibold text-red-600">
        Something went wrong
      </h1>
      <p className="max-w-md">{message}</p>
      {customMessage && <p className="max-w-xl">{customMessage}</p>}
      <Button
        onClick={() =>
          logout({
            logoutParams: { returnTo: window.location.origin },
          })
        }
        className="px-6 py-2 text-white"
      >
        Log in again
      </Button>
    </div>
  );
};

export default AuthError;
