import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, IAuthenticationCallback, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import { userPool } from '../cognito-config';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  confirmPassword: (email: string, code: string, newPass: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setupSession = (cognitoUser: CognitoUser) => {
    return new Promise<void>((resolve, reject) => {
        cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
                reject(err);
                return;
            }
            const userData = attributes?.reduce((acc, attr) => {
                acc[attr.getName()] = attr.getValue();
                return acc;
            }, {} as { [key: string]: string }) || {};

            const email = userData.email;
            const userProfile: User = {
                name: userData.name || email.split('@')[0],
                email: email,
                avatar: 'data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22%239ca3af%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M18.685%2019.097A9.723%209.723%200%200021.75%2012c0-5.385-4.365-9.75-9.75-9.75S2.25%206.615%202.25%2012a9.723%209.723%200%20003.065%207.097A9.716%209.716%200%200012%2021.75a9.716%209.716%200%20006.685-2.653zm-12.54-1.285A7.486%207.486%200%200112%2015a7.486%207.486%200%20015.855%202.812A8.224%208.224%200%200112%2020.25a8.224%208.224%200%2001-5.855-2.438zM15.75%209a3.75%203.75%200%2011-7.5%200%203.75%203.75%200%20017.5%200z%22%20clip-rule%3d%22evenodd%22%20%2f%3e%3c%2fsvg%3e',
            };

            setUser(userProfile);
            setIsAuthenticated(true);
            resolve();
        });
    });
  }

  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.getSession(async (err: Error | null, session: any) => {
            if (err) {
                console.error(err);
                setIsLoading(false);
                return;
            }
            if (session.isValid()) {
                await setupSession(cognitoUser);
            }
            setIsLoading(false);
        });
    } else {
        setIsLoading(false);
    }
  }, []);

  const signup = (email: string, pass: string) => {
    return new Promise((resolve, reject) => {
      const attributeList = [new CognitoUserAttribute({ Name: 'email', Value: email })];
      userPool.signUp(email, pass, attributeList, [], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  const confirmSignUp = (email: string, code: string) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  
  const login = (email: string, pass: string) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: pass });
      
      const callbacks: IAuthenticationCallback = {
        onSuccess: async (session) => {
          await setupSession(cognitoUser);
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        }
      };
      
      cognitoUser.authenticateUser(authDetails, callbacks);
    });
  };

  const forgotPassword = (email: string) => {
    return new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.forgotPassword({
        onSuccess: () => resolve(),
        onFailure: (err) => reject(err),
      });
    });
  };

  const confirmPassword = (email: string, code: string, newPass: string) => {
     return new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.confirmPassword(code, newPass, {
        onSuccess: () => resolve(),
        onFailure: (err) => reject(err),
      });
    });
  }

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, signup, confirmSignUp, forgotPassword, confirmPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};