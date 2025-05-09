'use client';
import { Grid, Button, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import TemplatesCard from './TemplatesCard';
import { Template } from '@/types/templates';
import { createTemplate } from '@/services/firestore/templates-db';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

interface TemplatesCardContainerProps {
  templates: Template[];
}

const TemplatesCardContainer = ({ templates }: TemplatesCardContainerProps) => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleCreateTemplate = async () => {
    try {
      if (!currentUser?.uid) {
        showError(
          'Authentication required',
          'Please sign in to create templates'
        );
        return;
      }
      // Todo: Update Name and Display Mode -- user input
      const templateId = await createTemplate(currentUser.uid, {
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

  return (
    <>
      {/*temp create template button*/}
      <Box mb={4} display='flex' justifyContent='flex-end'>
        <Button
          onClick={handleCreateTemplate}
          colorScheme='blue'
          leftIcon={<span>+</span>}
        >
          Create Template
        </Button>
      </Box>
      {/* existing templates */}
      <Grid
        templateColumns='repeat(auto-fit, minmax(220px, 1fr))'
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
            }) => (
              <TemplatesCard
                key={id}
                name={name}
                displayMode={displayMode}
                id={id}
                updatedAt={updatedAt}
                createdAt={createdAt}
                thumbnail={thumbnail}
                design={design}
              />
            )
          )}
      </Grid>
    </>
  );
};

export default TemplatesCardContainer;
