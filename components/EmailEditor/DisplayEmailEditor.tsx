'use client';
import { useRef, useCallback, useState, useEffect } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { uploadImageToS3 } from '@/services/storage/image-storage';
import { debounce } from 'lodash';
import { EmailDesign } from '@/types/templates';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  getTemplateById,
  saveTemplateDesign,
} from '@/services/firestore/templates-db';
// separate component
import { Button, ButtonGroup } from '@chakra-ui/react';
import { fetchMockDesigns, saveMockDesign } from '@/mocks/apiMocks';
import EmailEditorHeading from './EmailEditorHeader';

interface DisplayEmailEditorProps {
  templateId: string;
}

interface User {
  uid: string;
}

interface UnlayerDesignUpdateEvent {
  type: string;
  item: unknown;
  changes: unknown;
}

interface DesignLoadData {
  design: {
    idCounters: Record<string, number>;
    usageCounters: Record<string, number>;
    contents: Record<string, unknown>;
    columns: Record<string, unknown>;
    rows: Record<string, unknown>;
    bodies: Record<string, unknown>;
    pages: Record<string, unknown>;
    schemaVersion: number;
  };
}

type EnhancedEmailEditorOptions = EmailEditorProps['options'] & {
  tools?: {
    image?: {
      onUpload: (
        file: File,
        onSuccess: (data: {
          url: string;
          width: number;
          height: number;
        }) => void
      ) => void;
    };
    [key: string]: unknown;
  };
};

const DisplayEmailEditor = ({ templateId }: DisplayEmailEditorProps) => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth() as { currentUser: User | null };

  const [isClient, setIsClient] = useState(false);

  // Only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    return () => {
      const unlayer = emailEditorRef.current?.editor;
      if (unlayer) {
        unlayer.removeEventListener('design:loaded');
        unlayer.removeEventListener('design:updated');
      }
    };
  }, []);

  const handleImageUpload = async (
    file: File,
    onSuccess: (data: { url: string; width: number; height: number }) => void
  ) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }

      // Get image dimensions
      const dimensions = await getImageDimensions(file);

      // Upload to S3
      const uploadedImage = await uploadImageToS3(file, currentUser.uid, {
        width: dimensions.width,
        height: dimensions.height,
        contentType: file.type,
        fileName: file.name,
      });

      // Return data in format expected by Unlayer editor
      onSuccess({
        url: uploadedImage.url,
        width: uploadedImage.width ?? dimensions.width,
        height: uploadedImage.height ?? dimensions.height,
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Handle error
    }
  };

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // commit templates in redux
  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      console.log(design);
    });
  };

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign(async (design: EmailDesign) => {
      try {
        if (!currentUser?.uid) {
          throw new Error('User not authenticated');
        }

        // Use your existing function
        await saveTemplateDesign(currentUser.uid, templateId, design);
        console.log('Template saved to Firestore');
      } catch (error) {
        console.error('Error saving template:', error);
      }
    });
  };

  const onUpdateAutoSave = () => {
    // Design has been updated by the user
    saveDesign();
  };

  const debouncedAutoSave = useCallback(
    debounce((changes) => onUpdateAutoSave(), 5000),
    [templateId]
  );

  const onDesignUpdate = (data: UnlayerDesignUpdateEvent) => {
    const unlayer = emailEditorRef.current?.editor;
    // Design has been updated by the user
    console.log('design:updated', data);

    const { type, item, changes } = data;
    console.log('design:updated', type, item, changes);
    // Debounce the onUpdateAutoSave function to limit the number of call

    debouncedAutoSave(changes);

    // undo/redo state
    unlayer?.canUndo((result) => {
      result ? setCanUndo(result) : setCanUndo(false);
    });
    unlayer?.canRedo((result) => {
      result ? setCanRedo(result) : setCanRedo(false);
    });
  };

  const undo = () => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.undo();
  };

  const redo = () => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.redo();
  };

  const onDesignLoad = (data: DesignLoadData) => {
    console.log('onDesignLoad', data);
  };

  const onLoad: EmailEditorProps['onLoad'] = async (unlayer) => {
    unlayer.addEventListener('design:loaded', onDesignLoad);
    unlayer.addEventListener('design:updated', onDesignUpdate);

    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }

      setIsLoading(true);
      // Use your existing function with correct parameter order
      const template = await getTemplateById(templateId, currentUser.uid);

      if (template && template.design) {
        unlayer.loadDesign(template.design as any);
      } else {
        console.error('Template not found');
      }
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    console.log('onReady', unlayer);
  };

  if (!isClient) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      <EmailEditorHeading templateTitle='My Template' displayName='Email'>
        {/* create new component for btn group */}
        <ButtonGroup colorScheme='blue' my='2' size='sm'>
          <Button onClick={exportHtml}>Export HTML</Button>
          <Button onClick={saveDesign}>Save Template</Button>
          <Button onClick={undo} isDisabled={!canUndo}>
            Undo
          </Button>
          <Button onClick={redo} isDisabled={!canRedo}>
            Redo
          </Button>
        </ButtonGroup>
      </EmailEditorHeading>
      <EmailEditor
        options={
          {
            id: 'editor',
            tools: {
              image: { onUpload: handleImageUpload },
            },
          } as EnhancedEmailEditorOptions
        }
        ref={emailEditorRef}
        onReady={onReady}
        onLoad={onLoad}
        style={{ width: '100%', height: '100vh' }}
      />
    </>
  );
};

export default DisplayEmailEditor;
