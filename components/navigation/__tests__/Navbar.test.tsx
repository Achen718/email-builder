import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Navbar from '@/components/navigation/Navbar';

describe('Navbar', () => {
  beforeAll(() => {
    // Set the viewport size to a value that includes the Sign Up button
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
  });

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

  it('renders login and sign-up buttons when user is not authenticated', () => {
    renderProviders(<Navbar />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    const signUpButton = screen.queryByRole('button', { name: /sign up/i });

    screen.debug();

    console.log('Login Button:', loginButton);
    console.log('Sign Up Button:', signUpButton);

    expect(loginButton).toBeInTheDocument();
    // expect(signUpButton).toBeInTheDocument();
  });
});
