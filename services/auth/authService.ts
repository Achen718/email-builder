// replace with actual service call
export const userLogin = async (email: string, password: string) => {
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
    localStorage.setItem('userToken', data.userToken);
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

export const fetchUserData = async (token: string) => {
  try {
    const response = await fetch('/api/mockAuth/userAuth', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const { firstName, email } = await response.json();
    console.log(firstName, email);
    return firstName, email;
  } catch (error) {
    console.error('Fetch user data error:', error);
  }
};
