import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------

// Mock users for frontend-only auth
const MOCK_USERS = [
  {
    id: '1',
    displayName: 'Admin',
    phone: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    displayName: 'Manager',
    phone: 'manager',
    password: 'manager123',
    role: 'manager',
  },
];

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const STORAGE_KEY = 'mockAuthUser';

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        dispatch({ type: Types.INITIAL, payload: { user } });
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    dispatch({ type: Types.INITIAL, payload: { user: null } });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (phone: string, password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.phone === phone && u.password === password
    );

    if (!found) {
      throw new Error('Invalid credentials');
    }

    const user = {
      id: found.id,
      displayName: found.displayName,
      role: found.role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
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
