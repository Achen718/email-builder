'use client';
import { Grid, Button, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import TemplatesCard from './TemplatesCard';
import { Template } from '@/types/templates';
import { useTemplatesService } from '@/features/templates/hooks/useTemplatesService';
import { useNotification } from '@/hooks/useNotification';

interface TemplatesCardContainerProps {
  templates: Template[];
}

const TemplatesCardContainer = ({ templates }: TemplatesCardContainerProps) => {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const { createTemplate, deleteTemplate, isUserAuthenticated } =
    useTemplatesService();

  const handleCreateTemplate = async () => {
    if (!isUserAuthenticated) {
      showError(
        'Authentication required',
        'Please sign in to create templates'
      );
      return;
    }
    try {
      const templateId = await createTemplate({
        // todo: make name editable
        name: 'New Template',
        displayMode: 'email',
      });
      showSuccess('Template created');
      router.push(`/dashboard/templates/${templateId}`);
    } catch (error) {
      console.error('Error creating template:', error);
      showError(
        'Error creating template',
        error instanceof Error ? error.message : 'Please try again'
      );
    }
  };

  const handleDeleteTemplateInContainer = async (templateId: string) => {
    if (!isUserAuthenticated) {
      showError(
        'Authentication required',
        'Please sign in to delete templates'
      );
      return;
    }
    try {
      await deleteTemplate(templateId);
      showSuccess('Template deleted');
      router.refresh();
    } catch (error) {
      showError(
        'Error deleting template',
        error instanceof Error ? error.message : 'Please try again'
      );
    }
  };

  return (
    <>
      <Box mb={4} display='flex' justifyContent='flex-end'>
        <Button
          onClick={handleCreateTemplate}
          colorScheme='blue'
          leftIcon={<span>+</span>}
        >
          Create Template
        </Button>
      </Box>
      <Grid
        templateColumns='repeat(auto-fill, minmax(300px, 1fr))'
        mt='5'
        gap={6}
        p={4}
      >
        {templates &&
          templates.map(
            ({
              id,
              name,
              displayMode,
              updatedAt,
              createdAt,
              design,
              thumbnail,
              isDefault,
            }) => (
              <TemplatesCard
                key={id}
                name={name}
                displayMode={displayMode}
                id={id}
                updatedAt={updatedAt}
                createdAt={createdAt}
                thumbnail={thumbnail}
                isDefault={isDefault}
                design={design}
                onDelete={() => handleDeleteTemplateInContainer(id)}
              />
            )
          )}
      </Grid>
    </>
  );
};

export default TemplatesCardContainer;
