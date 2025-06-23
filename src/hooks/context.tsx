import { useMemo, useContext, createContext } from 'react';

const UserContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: any) => {
  const values = useMemo(() => ({ user: null, loading: false, setUser: () => {} }), []);
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
