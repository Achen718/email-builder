import '@testing-library/jest-dom';
import { renderProviders } from '@/utils/test.utils';
import { screen } from '@testing-library/react';
import Hero from '../Hero';

describe('Footer Component', () => {
  it('renders copyright text', () => {
    renderProviders(<Hero />);
    const heroText = screen.getByText(/Build beautiful emails/i);
    expect(heroText).toBeInTheDocument();
  });
});
