export const login = async (email: string, password: string) => {
  try {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};

export const signUp = async (
  firstName: string,
  email: string,
  password: string
) => {
  try {
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

    return await response.json();
  } catch (error) {
    console.error('Sign up error:', error);
  }
};
