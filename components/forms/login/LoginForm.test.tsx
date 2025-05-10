import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { renderProviders } from '@/utils/test.utils';

// Mock useAuth hook
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

    // Default mock implementation
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

    // Check if all form elements are rendered
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-form-button')).toBeInTheDocument();
    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
  });

  test('updates form state when inputs change', () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Update email field
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(emailInput).toHaveValue('user@example.com');

    // Update password field
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  test('submits form with entered credentials', () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByTestId('login-form-button');

    // Fill out form
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(submitButton);

    // Verify login was called with correct data
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  test('displays loading state during form submission', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoginLoading: true,
    });

    renderLoginForm();

    const submitButton = screen.getByTestId('login-form-button');

    // Check for disabled attribute
    expect(submitButton).toBeDisabled();

    // Check for data-loading attribute
    expect(submitButton).toHaveAttribute('data-loading');

    // Check for loading state spinner
    const spinner = submitButton.querySelector('.chakra-button__spinner');
    expect(spinner).toBeInTheDocument();
  });
});
