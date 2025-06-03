// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

import { jwtDecode } from 'jwt-decode';

// CHANGE:
// import { useAdminRole } from 'src/hooks/use-mocked-user';
// const { user } = useAdminRole();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export const useAdminRole = () => {
  const token = localStorage.getItem('accessToken') ?? '';
  const decodedToken = token ? jwtDecode<{ role: string; user: string }>(token ?? '') : null;
  const adminRole = decodedToken?.role;
  const user = {
    role: adminRole,
  };
  return { user, decodedToken };
};
