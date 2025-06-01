import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { renderProviders } from '@/utils/test.utils';

jest.mock('@/features/auth/hooks/useAuth');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  // Common variables
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoginLoading: false,
    });
  });

  const renderLoginForm = () => {
    return renderProviders(<LoginForm />);
  };
  test('renders form with all required fields', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-form-button')).toBeInTheDocument();
    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
  });

  test('updates form state when inputs change', () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(emailInput).toHaveValue('user@example.com');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  test('submits form with entered credentials', () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByTestId('login-form-button');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });
  test('displays loading state during form submission', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoginLoading: true,
    });

    renderLoginForm();
    const submitButton = screen.getByTestId('login-form-button');

    expect(submitButton).toBeDisabled();

    expect(submitButton).toHaveAttribute('data-loading');

    const spinner = submitButton.querySelector('.chakra-button__spinner');
    expect(spinner).toBeInTheDocument();
  });
});
