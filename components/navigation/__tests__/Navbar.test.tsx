import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Navbar from '@/components/navigation/Navbar';
import { Box } from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';

describe('Navbar', () => {
  it('renders the Navigation component', () => {
    renderProviders(<Navbar />);

    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderProviders(<Navbar />);

    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('renders login and sign-up buttons', () => {
    renderProviders(<Navbar />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    screen.debug();

    console.log('Login Button:', loginButton);
    console.log('Sign Up Button:', signUpButton);

    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
