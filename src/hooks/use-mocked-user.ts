import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const useAdminRole = () => {
  const { user } = useAuthContext();
  return { user: { role: user?.role as string | undefined } };
};
