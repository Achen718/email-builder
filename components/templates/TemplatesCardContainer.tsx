'use client';
import { Grid } from '@chakra-ui/react';
import TemplatesCard from './TemplatesCard';
import { Template } from '@/types/templates';

interface TemplatesCardContainerProps {
  templates: Template[];
}

const TemplatesCardContainer = ({ templates }: TemplatesCardContainerProps) => {
  return (
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
  );
};

export default TemplatesCardContainer;
