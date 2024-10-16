import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Navbar from '@/components/navigation/Navbar';

describe('Navbar', () => {
  it('renders the Navbar component', () => {
    renderProviders(<Navbar />);

    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderProviders(<Navbar />);

    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThan(0);
  });
});
