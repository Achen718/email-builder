import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import Page from '../app/page';

describe('Page', () => {
  it('renders a heading', () => {
    render(
      <ChakraProvider>
        <Page />
      </ChakraProvider>
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
