import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

interface LoginResponse {
  user: { email: string };
  userToken: string;
}

interface LoginError {
  message: string;
}

interface SignUpResponse {
  user: User;
  userToken: string;
}

interface User {
  firstName: string;
  email: string;
  password: string;
}

const mockDatabase: User[] = [];

const initializeMockDatabase = async () => {
  const hashedPassword = await bcrypt.hash('password', SALT_ROUNDS);
  mockDatabase.push({
    firstName: 'Alvin',
    email: 'email@example.com',
    password: hashedPassword,
  });
};

initializeMockDatabase();

const generateFakeToken = (email: string): string => {
  return btoa(`${email}:${new Date().getTime()}`);
};

const findUserByEmail = (email: string): User | undefined => {
  return mockDatabase.find((user) => user.email === email);
};

const createUser = (user: User): void => {
  mockDatabase.push(user);
};

export const mockSignUp = async (
  firstName: string,
  email: string,
  password: string
): Promise<SignUpResponse> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const userExists = mockDatabase.some((user) => user.email === email);
      if (userExists) {
        reject(new Error('User already exists'));
      } else {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = { firstName, email, password: hashedPassword };
        createUser(newUser);
        const userToken = generateFakeToken(email);
        resolve({
          userToken,
          user: { firstName, email, password },
        });
      }
    }, 500);
  });
};

export const mockLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const user = findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const userToken = generateFakeToken(email);
        resolve({ userToken, user: { email } });
      } else {
        reject(new Error('Invalid credentials, failed'));
      }
    }, 500);
  });
};

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = atob(token);
    const [email] = decoded.split(':');
    const user = mockDatabase.find((user) => user.email === email);
    return user ? email : null;
  } catch {
    return null;
  }
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
