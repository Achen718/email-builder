import React from 'react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import StoreProvider from '@/app/providers/StoreProvider';
import { render, screen } from '@testing-library/react';
import Login from '@/components/forms/login/LoginForm';
import { useRouter } from 'next/navigation';
import { mockLogin } from '../../mocks/authMocks';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../mocks/authMocks', () => ({
  mockLogin: jest.fn(),
}));

describe('Login Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(
      <StoreProvider>
        <ChakraProvider>
          <Login />
        </ChakraProvider>
      </StoreProvider>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('mock login', async () => {
    mockLogin('email@example.com', 'password');

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith('email@example.com', 'password');
  });
});
