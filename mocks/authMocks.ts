interface LoginResponse {
  user: { email: string };
  userToken: string;
}

interface LoginError {
  message: string;
}

interface SignUpResponse {
  user: { firstName: string; email: string; password: string };
  userToken: string;
}

interface User {
  firstName: string;
  email: string;
  password: string;
}

const mockDatabase: User[] = [
  {
    firstName: 'Alvin',
    email: 'email@example.com',
    password: 'password',
  },
];

const findUserByEmail = (email: string): User | undefined => {
  return mockDatabase.find((user) => user.email === email);
};

const createUser = (user: User): void => {
  mockDatabase.push(user);
};

export const mockSignUp = (
  firstName: string,
  email: string,
  password: string
): Promise<SignUpResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        reject(new Error('User already exists'));
      } else {
        createUser({ firstName, email, password });
        resolve({
          user: { firstName, email, password },
          userToken: 'fake-jwt-token',
        });
      }
    }, 500);
  });
};

export const mockLogin = (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'email@example.com' && password === 'password') {
        resolve({ userToken: 'fake-jwt-token', user: { email } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const verifyToken = (token: string): string | null => {
  if (token === 'fake-jwt-token') {
    return 'email@example.com';
  }
  return null;
};

export const fetchMockUserData = (token: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const email = verifyToken(token);
      if (!email) {
        reject(new Error('Invalid token'));
      } else {
        const user = findUserByEmail(email);
        resolve(user || null);
      }
    }, 500);
  });
};
