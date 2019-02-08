export const makeAuthToken = (login, token) => {
  const authToken = btoa(`${login} + ${token}`);
  return authToken;
};