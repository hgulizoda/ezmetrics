import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: { user: AuthUserType };
  [Types.LOGIN]: { user: AuthUserType };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const MOCK_ADMIN_USER = {
  _id: 'admin1',
  displayName: 'Admin',
  email: 'admin@ezmertrics.uz',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'Adminov',
  phone: '+998901000000',
};

const initialState: AuthStateType = {
  user: MOCK_ADMIN_USER,
  loading: false,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return { loading: false, user: action.payload.user };
  }
  if (action.type === Types.LOGIN) {
    return { ...state, user: action.payload.user };
  }
  if (action.type === Types.LOGOUT) {
    return { ...state, user: null };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    dispatch({
      type: Types.INITIAL,
      payload: { user: MOCK_ADMIN_USER },
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN - fake, no backend call
  const login = useCallback(
    async (_email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 500));
      dispatch({
        type: Types.LOGIN,
        payload: { user: MOCK_ADMIN_USER },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    dispatch({ type: Types.LOGOUT });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      logout,
    }),
    [login, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
