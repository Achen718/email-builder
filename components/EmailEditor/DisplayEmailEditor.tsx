'use client';
import { useRef, useEffect } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { fetchMockDesign, saveMockDesign } from '@/mocks/apiMocks';

interface DisplayEmailEditorProps {
  templateId: string;
}

const DisplayEmailEditor = ({ templateId }: DisplayEmailEditorProps) => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      console.log(design);
    });
  };

  useEffect(() => {
    const loadDesign = async () => {
      const design = await fetchMockDesign(templateId);
      emailEditorRef.current?.editor.loadDesign(design);
    };

    loadDesign();
  }, [templateId]);

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign(async (design) => {
      // save to database
      await saveMockDesign(templateId, design);
      console.log('saveDesign', design);
      alert('Design JSON has been logged in your developer console.');
    });
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
      <div>
        <button onClick={exportHtml}>Export HTML</button>
        <button onClick={saveDesign}>Save Design</button>
      </div>

      <EmailEditor ref={emailEditorRef} onReady={onReady} />
    </>
  );
};

export default DisplayEmailEditor;
