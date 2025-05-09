import { screen } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import { TemplatesCardContainer } from '@/app/(app)/dashboard/templates/_components/index';
import { Template, EmailDesign } from '@/types/templates';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/(app)/dashboard/templates/_components/TemplatesCard', () => {
  return function MockTemplatesCard({
    name,
    thumbnail,
  }: {
    name: string;
    thumbnail: string;
  }) {
    // Only using the props we need in the test
    return (
      <div data-testid='template-card'>
        <span>{name}</span>
        <img src={thumbnail || ''} alt={name} />
      </div>
    );
  };
});

const mockEmailDesign = {
  body: {
    id: 'mock-body-id',
    headers: [],
    footers: [],
    rows: [
      {
        id: 'mock-row-id',
        columns: [],
        cells: [1],
        values: {},
      },
    ],
    values: {},
  },
  counters: {
    u_row: 1,
    u_column: 1,
  },
  schemaVersion: 1,
} as EmailDesign;

const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Template 1',
    thumbnail: '/image1.jpg',
    displayMode: 'default',
    createdAt: new Date(),
    updatedAt: new Date(),
    design: mockEmailDesign,
  },
  {
    id: 'template-2',
    name: 'Template 2',
    thumbnail: '/image2.jpg',
    displayMode: 'default',
    createdAt: new Date(),
    updatedAt: new Date(),
    design: mockEmailDesign,
  },
];

describe('TemplatesCardContainer', () => {
  test('should render all template cards correctly', () => {
    renderProviders(<TemplatesCardContainer templates={mockTemplates} />);

    // Test card content rendering
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBe(2);
  });

  test('should render no cards when templates array is empty', () => {
    renderProviders(<TemplatesCardContainer templates={[]} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
