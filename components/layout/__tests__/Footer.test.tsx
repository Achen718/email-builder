import '@testing-library/jest-dom';
import { renderProviders } from '@/utils/test.utils';
import { screen } from '@testing-library/react';
import Footer, { footerLinks } from '../Footer';

describe('Footer Component', () => {
  it('renders copyright text', () => {
    renderProviders(<Footer />);

    const footerText = screen.getByText(/All rights reserved/i);
    expect(footerText).toBeInTheDocument();
  });

  it('renders footer links', () => {
    renderProviders(<Footer />);

    const footerLinksElements = screen.getAllByRole('link');
    expect(footerLinksElements.length).toBeGreaterThan(0);

    footerLinks.forEach((link) => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', link.href);
    });
  });
});
