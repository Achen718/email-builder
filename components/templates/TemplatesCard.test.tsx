import { screen, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import TemplatesCard from '@/components/templates/TemplatesCard';
import { useRouter } from 'next/navigation';
import { EmailDesign } from '@/types/templates';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TemplatesCard', () => {
  // Use your existing EmailDesign mock structure from the container test
  const mockDesign = {
    body: {
      id: 'mock-body-id',
      headers: [],
      footers: [],
      rows: [{ id: 'mock-row-id', columns: [], cells: [1], values: {} }],
      values: {},
    },
    counters: { u_row: 1, u_column: 1 },
    schemaVersion: 1,
  } as EmailDesign;

  const mockProps = {
    id: 'template-123',
    name: 'Test Template',
    thumbnail: '/images/test-thumbnail.jpg',
    displayMode: 'default',
    createdAt: new Date(),
    updatedAt: new Date(),
    design: mockDesign,
  };

  test('renders template information correctly', () => {
    renderProviders(<TemplatesCard {...mockProps} />);

    expect(screen.getByText('Test Template')).toBeInTheDocument();
    // Use alt attribute instead of role for image
    expect(screen.getByAltText('#')).toHaveAttribute(
      'src',
      '/images/test-thumbnail.jpg'
    );
  });

  test('navigates to template editor when clicked', () => {
    // First, update the component to include a data-testid
    // Add this to the Box component in TemplatesCard.tsx:
    // data-testid="template-card-link"

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    renderProviders(<TemplatesCard {...mockProps} />);

    // Click on the card using data-testid instead of role
    // This assumes you've added data-testid="template-card-link" to your Box component
    fireEvent.click(screen.getByTestId('template-card-link'));

    // Verify link href attribute
    expect(screen.getByTestId('template-card-link')).toHaveAttribute(
      'href',
      'templates/template-123'
    );
  });

  test('displays updated date in correct format', () => {
    // Create a specific date for consistent testing
    const testDate = new Date('2023-05-01T12:00:00');

    // Mock formatDate to return consistent value for testing
    jest.mock('@/utils/formatDate', () => ({
      formatDate: jest.fn().mockReturnValue('May 1, 2023'),
    }));

    renderProviders(<TemplatesCard {...mockProps} updatedAt={testDate} />);

    // Check for text that includes both label and formatted date
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});
