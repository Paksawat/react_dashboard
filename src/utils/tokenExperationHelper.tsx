/**
 * Helper function to check if the Auth0 token in localStorage is expired.
 *
 * @returns {boolean} true if the token is expired, false if valid
 */
export function isAuth0TokenExpired() {
  const auth0Keys = Object.keys(localStorage).filter(
    (key) => key.startsWith("@@auth0spajs@@") && key.includes("hird-app-prod")
  );

  if (!auth0Keys.length) {
    console.warn("No Auth0 tokens found in localStorage.");
    return true;
  }

  let isExpired = true;

  for (const key of auth0Keys) {
    try {
      const authData = JSON.parse(localStorage.getItem(key) || "{}");

      if (authData?.body?.access_token) {
        const accessToken = authData.body.access_token;

        // Decode the JWT token to check its expiry time
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        const expiryTime = decodedToken?.exp;

        if (expiryTime && expiryTime * 1000 > Date.now()) {
          isExpired = false;
          break;
        }
      }
    } catch (error) {
      console.error(`Error parsing Auth0 token for key ${key}:`, error);
    }
  }

  return isExpired;
}
