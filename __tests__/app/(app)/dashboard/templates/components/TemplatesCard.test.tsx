import { screen, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import { TemplatesCard } from '@/app/(app)/dashboard/templates/_components/index';
import { useRouter } from 'next/navigation';
import { EmailDesign } from '@/types/templates';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TemplatesCard', () => {
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
    expect(
      screen.getByAltText('Green double couch with wooden legs')
    ).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimages%2Ftest-thumbnail.jpg&w=3840&q=75'
    );
  });
  test('navigates to template editor when clicked', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    renderProviders(<TemplatesCard {...mockProps} />);

    const link = screen.getByRole('link', { name: 'Test Template' });
    fireEvent.click(link);

    expect(link).toHaveAttribute('href', 'templates/template-123');
  });
  test('displays updated date in correct format', () => {
    const testDate = new Date('2023-05-01T12:00:00');

    jest.mock('@/utils/formatDate', () => ({
      formatDate: jest.fn().mockReturnValue('May 1, 2023'),
    }));
    renderProviders(<TemplatesCard {...mockProps} updatedAt={testDate} />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});
