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
        console.log(accessToken);
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get(`/api/v1/account-info/${accessToken}`);
          const { user } = response.data;
          console.log(user);

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

  const login = async (id: string, password: string) => {
    await axios
      .post('/api/v1/login', {
        email: id,
        pass: password
      })
      .then((res: any) => {
        localStorage.setItem('accessToken', res.data.token);
        console.log(localStorage.getItem('accessToken'));
        setSession(res.data.token);
      })
      .catch((err) => err);

    // const response = await axios.post('/api/v1/login', {
    //   email,
    //   password
    // });
    const user = [
      {
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        displayName: 'Jaydon Frankie',
        email: 'demo@minimals.cc',
        password: 'demo1234',
        photoURL: '/static/mock-images/avatars/avatar_default.jpg',
        phoneNumber: '+40 777666555',
        country: 'United States',
        address: '90210 Broadway Blvd',
        state: 'California',
        city: 'San Francisco',
        zipCode: '94116',
        about: 'a',
        role: 'admin',
        isPublic: true
      }
    ];

    dispatch({
      type: Types.Login,
      payload: {
        user
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
