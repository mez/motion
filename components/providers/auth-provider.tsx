'use client';

import { createContext } from 'react';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import { pb } from '@/lib/pb';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  REGISTER_INVITE = 'REGISTER_INVITE',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUser;
  };
  [Types.LOGIN]: {
    user: AuthUser;
  };
  [Types.REGISTER]: {
    user: AuthUser;
  };
  [Types.REGISTER_INVITE]: {
    user: AuthUser;
  };
  [Types.LOGOUT]: undefined;
};


export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUser | null;
};

// ----------------------------------------------------------------------

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
  if (action.type === Types.REGISTER) {
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

export type PocketBaseContextType = {
  user: AuthUser;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as PocketBaseContextType);

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      if (pb.authStore.isValid) {

        const user = pb.authStore.model;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);

      dispatch({
        type: Types.LOGIN,
        payload: {
          user: pb.authStore.model as AuthUser,
        },
      });

    } catch (error) {
      console.log('error logging in user === ', error.originalError);
      throw error;
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, passwordConfirm: string, name: string) => {
      const data = {
        email,
        password,
        passwordConfirm,
        name
      };

      try {
        
        const result = await pb.collection('users').create(data);
        await login(email, password)

      } catch (error) {
        console.log(error);
        
      }

      // const response = await axios.post(endpoints.auth.register, data);

      // const { accessToken, user } = response.data;


      // dispatch({
      //   type: Types.REGISTER,
      //   payload: {
      //     user,
      //   },
      // });
    },
    [login]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    pb.authStore.clear();
    
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'pocketbase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
