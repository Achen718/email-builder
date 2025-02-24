import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Navbar from '@/components/navigation/Navbar';

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

    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
