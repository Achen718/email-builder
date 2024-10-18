interface LoginResponse {
  token: string;
}

interface LoginError {
  message: string;
}

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
