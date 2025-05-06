import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { renderProviders } from '@/utils/test.utils';
import DisplayEmailEditor from './DisplayEmailEditor';
import { EditorRef, EmailEditorProps } from 'react-email-editor';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  getTemplateById,
  saveTemplateDesign,
} from '@/services/firestore/templates-db';
import { uploadImageToS3 } from '@/services/storage/image-storage';
import { isEmailDesign } from '@/utils/validateEmailDesign';

jest.mock('@/features/auth/hooks/useAuth');
jest.mock('@/services/firestore/templates-db');
jest.mock('@/services/storage/image-storage');
jest.mock('@/utils/validateEmailDesign');

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('rq-uuid-v4'),
}));

jest.mock('react-email-editor', () => {
  // Create mock editor object
  const mockUnlayerEditor = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    loadDesign: jest.fn(),
    saveDesign: jest.fn().mockImplementation((callback) => {
      callback({
        body: { rows: [] },
        counters: { u_row: 1, u_column: 1 },
        schemaVersion: 1,
      });
    }),
    exportHtml: jest.fn().mockImplementation((callback) =>
      callback({
        design: { body: { rows: [] } },
        html: '<div>Mock HTML</div>',
      })
    ),
    canUndo: jest.fn().mockImplementation((callback) => callback(true)),
    canRedo: jest.fn().mockImplementation((callback) => callback(false)),
    undo: jest.fn(),
    redo: jest.fn(),
  };

  // Todo: fix 'any' type
  const FakeEditor = React.forwardRef((props: any, ref) => {
    React.useImperativeHandle(ref, () => ({
      editor: mockUnlayerEditor,
    }));
    // Todo: remove setTimeouts -- replace with jest timers or similar
    setTimeout(() => {
      if (props.onReady) {
        props.onReady(mockUnlayerEditor);
      }

      if (props.onLoad) {
        props.onLoad(mockUnlayerEditor);
      }
    }, 10);

    return <div data-testid='email-editor'>Mock Email Editor</div>;
  });

  return {
    __esModule: true,
    default: FakeEditor,
  };
});

// Mock for the image handling
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();
global.Image = class {
  onload = jest.fn();
  onerror = jest.fn();
  width = 800;
  height = 600;

  private _src = '';

  get src() {
    return this._src;
  }

  set src(url: string) {
    this._src = url;
    // Todo: remove setTimeouts -- replace with jest timers or similar
    setTimeout(() => this.onload(), 0);
  }
} as unknown as typeof Image;

describe('DisplayEmailEditor', () => {
  const mockUser = { uid: 'test-user-123' };
  const mockTemplate = {
    id: 'template-123',
    name: 'Test Template',
    design: { body: { rows: [] } },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup auth mock
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    // Setup template retrieval mock
    (getTemplateById as jest.Mock).mockResolvedValue(mockTemplate);

    // Setup isEmailDesign mock
    (isEmailDesign as unknown as jest.Mock).mockReturnValue(true);

    // mock uploadImageToS3
    (uploadImageToS3 as jest.Mock).mockResolvedValue({
      url: 'https://example.com/test-image.jpg',
      width: 800,
      height: 600,
    });
  });

  test('renders the email editor', async () => {
    renderProviders(<DisplayEmailEditor templateId='template-123' />);

    await waitFor(() => {
      expect(screen.getByTestId('email-editor')).toBeInTheDocument();
    });
  });

  test('loads template when component mounts', async () => {
    jest.clearAllMocks();

    renderProviders(<DisplayEmailEditor templateId='template-123' />);

    // Wait for editor to be in document
    await waitFor(() => {
      expect(screen.getByTestId('email-editor')).toBeInTheDocument();
    });

    expect(useAuth).toHaveBeenCalled();

    await waitFor(() => {
      expect(getTemplateById).toHaveBeenCalledWith(
        'template-123',
        'test-user-123'
      );
    });
  });

  test('saveDesign calls saveTemplateDesign when save button is clicked', async () => {
    const { getByText } = renderProviders(
      <DisplayEmailEditor templateId='template-123' />
    );

    await waitFor(() => {
      expect(screen.getByTestId('email-editor')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Save Template'));

    await waitFor(() => {
      expect(saveTemplateDesign).toHaveBeenCalledWith(
        'test-user-123',
        'template-123',
        expect.objectContaining({
          body: expect.any(Object),
          counters: expect.any(Object),
          schemaVersion: expect.any(Number),
        })
      );
    });
  });

  test('handles image upload correctly', async () => {
    const component = renderProviders(
      <DisplayEmailEditor templateId='template-123' />
    );
  });
});
