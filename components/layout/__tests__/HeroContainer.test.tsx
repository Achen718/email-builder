import { render } from '@testing-library/react';
import HeroContainer from '@/components/layout/HeroContainer';

describe('Hero Container', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <HeroContainer>
        <div>Test Child</div>
      </HeroContainer>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
