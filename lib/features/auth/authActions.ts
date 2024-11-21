import { createAsyncThunk } from '@reduxjs/toolkit';

export const userSignUp = createAsyncThunk(
  'auth/signUp',
  async (
    {
      firstName,
      email,
      password,
    }: { firstName: string; email: string; password: string },
    { rejectWithValue }
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
      return rejectWithValue(error);
    }
  }
);

export const userLogin = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
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
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
