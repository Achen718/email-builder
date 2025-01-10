import { mockLogin, mockSignUp, fetchMockUserData } from '@/mocks/authMocks';
// replace with actual service call
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await mockLogin(email, password);
    // Simulate storing the token in localStorage
    localStorage.setItem('userToken', response.userToken);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

export const signUp = async (
  firstName: string,
  email: string,
  password: string
) => {
  try {
    const response = await mockSignUp(firstName, email, password);
    // Simulate storing the token in localStorage
    localStorage.setItem('userToken', response.userToken);
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error('Sign up failed');
  }
};

export const fetchUserData = async (token: string) => {
  try {
    const userData = await fetchMockUserData(token);
    if (!userData) {
      throw new Error('Failed to fetch user data');
    }
    const { email, firstName } = userData;
    return { email, firstName };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to fetch user data');
  }
};
