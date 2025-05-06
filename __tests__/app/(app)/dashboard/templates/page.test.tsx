import { render, screen, fireEvent } from '@testing-library/react';
import TemplatesPage from '@/app/(app)/dashboard/templates/page';
import { useItems } from '@/app/(app)/dashboard/_hooks';
import { renderProviders } from '@/utils/test.utils';
// Mock the hook used by your page component
jest.mock('@/app/(app)/dashboard/_hooks', () => ({
  useItems: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Templates Page', () => {
  test('should display templates when loaded', async () => {
    // Mock the hook return value
    (useItems as jest.Mock).mockReturnValue({
      items: [
        { id: '1', name: 'Template 1', thumbnail: '/path/to/image1.jpg' },
        { id: '2', name: 'Template 2', thumbnail: '/path/to/image2.jpg' },
      ],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderProviders(<TemplatesPage />);

    // Verify templates appear
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
  });

  test('should show loading state correctly', () => {
    (useItems as jest.Mock).mockReturnValue({
      items: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderProviders(<TemplatesPage />);

    // Verify loading message appears
    expect(screen.getByText(/Loading Templates/i)).toBeInTheDocument();
  });

  test('should show error message when error occurs', () => {
    (useItems as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: new Error('Failed to load templates'),
      refetch: jest.fn(),
    });

    render(<TemplatesPage />);

    // Verify error message appears
    expect(screen.getByText(/error loading templates/i)).toBeInTheDocument();
  });

  test('should show no templates message when empty array is returned', () => {
    (useItems as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TemplatesPage />);

    // Verify "No Templates Found" message appears
    expect(screen.getByText('No Templates Found')).toBeInTheDocument();
  });

  // Add this test to check the refetch functionality
  test('should call refetch when Check Again button is clicked', () => {
    const mockRefetch = jest.fn();
    (useItems as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<TemplatesPage />);

    // Click the "Check Again" button
    fireEvent.click(screen.getByText('Check Again'));

    // Verify refetch was called
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
