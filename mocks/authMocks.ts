interface LoginResponse {
  token: string;
}

interface LoginError {
  message: string;
}

interface SignUpResponse {
  message: string;
}

interface User {
  firstName: string;
  email: string;
  password: string;
}

const mockDatabase: User[] = [];

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
        resolve({ message: 'User registered successfully' });
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
        resolve({ token: 'fake-jwt-token' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const mockLogout = (): Promise<LoginError> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Logged out successfully' });
    }, 500);
  });
};
