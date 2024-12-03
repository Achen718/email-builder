'use client';
import { useRef, useState } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
// separate component
import { Button, ButtonGroup } from '@chakra-ui/react';
import { fetchMockDesign, saveMockDesign } from '@/mocks/apiMocks';
import EmailEditorHeading from './EmailEditorHeader';

interface DisplayEmailEditorProps {
  templateId: string;
}

const DisplayEmailEditor = ({ templateId }: DisplayEmailEditorProps) => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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

    unlayer?.saveDesign(async (design) => {
      // post to database
      await saveMockDesign(templateId, design);
      console.log('saveDesign', design);
    });
  };

  const onUpdateAutoSave = (updates) => {
    // Design has been updated by the user
    saveDesign();
  };

  // temp debounce
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const onDesignUpdate = (data) => {
    const unlayer = emailEditorRef.current?.editor;
    // Design has been updated by the user

    const { type, item, changes } = data;
    console.log('design:updated', type, item, changes);
    // Debounce the onUpdateAutoSave function to limit the number of calls

    // add to saga
    const debouncedAutoSave = debounce(onUpdateAutoSave, 5000);
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

  const onDesignLoad = (data) => {
    console.log('onDesignLoad', data);
  };

  const onLoad: EmailEditorProps['onLoad'] = async (unlayer) => {
    console.log('onLoad', unlayer);
    unlayer.addEventListener('design:loaded', onDesignLoad);
    unlayer.addEventListener('design:updated', onDesignUpdate);
    const design = await fetchMockDesign(templateId);
    unlayer.loadDesign(design);

    return () => {
      unlayer.removeEventListener('design:loaded');
      unlayer.removeEventListener('design:updated');
    };
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);

    console.log('onReady', unlayer);
  };

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
      <EmailEditor ref={emailEditorRef} onReady={onReady} onLoad={onLoad} />
    </>
  );
};

export default DisplayEmailEditor;
