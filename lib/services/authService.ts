export const login = async (email: string, password: string) => {
  const response = await fetch('/api/mockAuth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const signUp = async (
  firstName: string,
  email: string,
  password: string
) => {
  const response = await fetch('/api/mockAuth/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, email, password }),
  });

  if (!response.ok) {
    throw new Error('Error creating user');
  }

  return response.json();
};
