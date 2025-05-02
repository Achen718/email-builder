import '@testing-library/jest-dom';
import { screen, within, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Navbar from '@/components/navigation/Navbar';

// Define constants for our tests
const navItems = [
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Customers', href: '/customers' },
];

describe('Navbar', () => {
  describe('Structure and Rendering', () => {
    it('renders the navigation component', () => {
      renderProviders(<Navbar />);
      const navbarElement = screen.getByRole('navigation');
      expect(navbarElement).toBeInTheDocument();
    });

    it('renders the logo and brand name', () => {
      renderProviders(<Navbar />);
      const logoContainer = screen.getByTestId('navbar-logo');
      expect(logoContainer).toBeInTheDocument();

      const logoText = screen.getByText('E');
      const brandName = screen.getByText('EmailBuilder');
      expect(logoText).toBeInTheDocument();
      expect(brandName).toBeInTheDocument();
    });

    it('renders theme toggle button', () => {
      renderProviders(<Navbar />);
      const themeToggleButton = screen.getByTestId('theme-toggle');
      expect(themeToggleButton).toBeInTheDocument();
    });
  });

  describe('Navigation and Links', () => {
    it('renders all navigation links in desktop view', () => {
      renderProviders(<Navbar />);
      navItems.forEach((item) => {
        const navItem = screen.getByTestId(
          `nav-item-${item.label.toLowerCase()}`
        );
        const link = navItem.closest('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', item.href);
      });
    });

    it('renders login and sign-up buttons', () => {
      renderProviders(<Navbar />);
      const loginButton = screen.getByTestId('login-button');
      const registerButton = screen.getByTestId('register-button');
      expect(loginButton).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
    });

    it('has correct hrefs for all navigation links', () => {
      renderProviders(<Navbar />);
      // Logo link
      const logoContainer = screen.getByTestId('navbar-logo');
      const homeLink = logoContainer.closest('a');
      expect(homeLink).toHaveAttribute('href', '/');

      // Auth links
      const loginButton = screen.getByTestId('login-button');
      const loginLink = loginButton.closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');

      const registerButton = screen.getByTestId('register-button');
      const signUpLink = registerButton.closest('a');
      expect(signUpLink).toHaveAttribute('href', '/sign-up');
    });
  });

  describe('Responsive Behavior and User Interactions', () => {
    beforeEach(() => {
      // Mock window.matchMedia for responsive testing
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false, // Simulate mobile view
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('renders hamburger menu in mobile view', () => {
      renderProviders(<Navbar />);
      const hamburgerButton = screen.getByTestId('mobile-toggle');
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('toggles mobile menu when hamburger is clicked', () => {
      renderProviders(<Navbar />);
      // Mobile menu should not be visible initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

      // Click hamburger button
      const hamburgerButton = screen.getByTestId('mobile-toggle');
      fireEvent.click(hamburgerButton);

      // Now mobile menu should be visible
      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toBeInTheDocument();

      // Should show all nav links in mobile menu
      navItems.forEach((item) => {
        const mobileNavItem = screen.getByTestId(
          `mobile-nav-item-${item.label.toLowerCase()}`
        );
        expect(mobileNavItem).toBeInTheDocument();
        expect(mobileNavItem.textContent).toBe(item.label);
      });

      // Mobile menu should have login and signup buttons
      const mobileLoginButton = screen.getByTestId('mobile-login-button');
      const mobileRegisterButton = screen.getByTestId('mobile-register-button');
      expect(mobileLoginButton).toBeInTheDocument();
      expect(mobileRegisterButton).toBeInTheDocument();
    });
  });
});
