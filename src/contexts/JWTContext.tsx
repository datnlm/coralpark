import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
// import axios from '../utils/axios';
import axios from 'axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/authentication';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER'
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          // set bearer token
          axios.defaults.headers.common = {
            Authorization: `Bearer ${accessToken}`
          };
          const response = await axios.get('/api/v1/account-info', {
            params: { token: accessToken }
          });
          const user = response.data;
          if (response.data.role == 'AD') {
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: true,
                user
              }
            });
          } else {
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (id: string, pass: string) => {
    await axios
      .post('/api/v1/login', {
        username: id,
        password: pass
      })
      .then(async (res: any) => {
        localStorage.setItem('accessToken', res.data.token);
        setSession(res.data.token);
        // set bearer token
        axios.defaults.headers.common = {
          Authorization: `Bearer ${res.data.token}`
        };
        const response = await axios.get('/api/v1/account-info', {
          params: { token: res.data.token }
        });
        const user = response.data;
        if (response.data.role == 'AD') {
          dispatch({
            type: Types.Login,
            payload: {
              user
            }
          });
        }
      });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: Types.Register,
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  const resetPassword = (email: string) => console.log(email);

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        user: {
          id: state?.user?.sub,
          photoURL: state?.user?.imageUrl,
          email: state?.user?.email,
          username: state?.user?.username,
          displayName: state?.user?.name,
          role: state?.user?.roleName
        },
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
