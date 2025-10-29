import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="memory"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
