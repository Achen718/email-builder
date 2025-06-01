import { screen, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import SignUpForm from './SignUpForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';

jest.mock('@/features/auth/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(),
  };
});

const renderSignUpForm = () => {
  return renderProviders(<SignUpForm />);
};

describe('SignUpForm', () => {
  const mockSignUp = jest.fn();
  const mockPush = jest.fn();
  const mockToast = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isSignUpLoading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });
  it('renders form with all required fields', () => {
    renderSignUpForm();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates form state when inputs change', () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    expect(firstNameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('shows error when passwords do not match', async () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign up/i });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password456' },
    });
    fireEvent.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Passwords do not match',
        status: 'error',
      })
    );

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('submits form when passwords match', async () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign up/i });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(submitButton);

    expect(mockSignUp).toHaveBeenCalledWith({
      displayName: 'John',
      email: 'john@example.com',
      password: 'password123',
    });
  });
  it('displays loading state during form submission', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isSignUpLoading: true,
    });

    renderSignUpForm();
    const submitButton = screen.getByTestId('sign-up-form-button');

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('data-loading');

    const spinner = submitButton.querySelector('.chakra-button__spinner');
    expect(spinner).toBeInTheDocument();
  });
});
