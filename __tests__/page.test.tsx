import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import Page from '../app/page';

describe('Page', () => {
  it('renders a heading', () => {
    renderProviders(<Page />);

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
