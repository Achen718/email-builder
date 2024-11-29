'use client';
import { Grid } from '@chakra-ui/react';
import TemplatesCard from './TemplatesCard';
import { TemplatesCardContainerProps } from '@/types/templates';

const TemplatesCardContainer = ({ templates }: TemplatesCardContainerProps) => {
  return (
    <Grid templateColumns='repeat(auto-fit, minmax(220px, 1fr))' mt='5' gap={6}>
      {templates &&
        templates.map(({ id, name, displayMode, updatedAt }) => (
          <TemplatesCard
            key={id}
            name={name}
            displayMode={displayMode}
            id={id}
            updatedAt={updatedAt}
          />
        ))}
    </Grid>
  );
};

export default TemplatesCardContainer;
