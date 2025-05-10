import { within, screen, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import SignUpForm from './SignUpForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';

// Mock the required hooks and components
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

// Helper function to render with required providers
const renderSignUpForm = () => {
  return renderProviders(<SignUpForm />);
};

describe('SignUpForm', () => {
  const mockSignUp = jest.fn();
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock return values
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isSignUpLoading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  test('renders form with all required fields', () => {
    renderSignUpForm();

    // Check if all form elements are rendered
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

  test('updates form state when inputs change', () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    // Simulate user input
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Check if inputs reflect the changes
    expect(firstNameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  test('shows error when passwords do not match', async () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign up/i });

    // Fill out form with mismatched passwords
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password456' },
    });
    fireEvent.click(submitButton);

    // Verify toast was called with error message
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Passwords do not match',
        status: 'error',
      })
    );

    // Verify signup wasn't called
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('submits form when passwords match', async () => {
    renderSignUpForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign up/i });

    // Fill out form correctly
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(submitButton);

    // Verify signup was called with correct data
    expect(mockSignUp).toHaveBeenCalledWith({
      displayName: 'John',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  test('displays loading state during form submission', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isSignUpLoading: true,
    });

    renderSignUpForm();

    const submitButton = screen.getByTestId('sign-up-form-button');

    // Check for disabled attribute
    expect(submitButton).toBeDisabled();
    // Check for aria-disabled attribute
    expect(submitButton).toHaveAttribute('data-loading');

    // Check for loading state -- spinnner only appears when loading=true
    const spinner = submitButton.querySelector('.chakra-button__spinner');
    expect(spinner).toBeInTheDocument();
  });
});
