'use client';
import { Container, Grid, Heading } from '@chakra-ui/react';
import TemplatesCards from './TemplatesCards';
import { TemplatesCardContainerProps } from '@/types/templates';

const TemplatesCardContainer = ({ templates }: TemplatesCardContainerProps) => {
  return (
    <>
      <Heading my='6'>Template card Container</Heading>
      <Grid templateColumns='repeat(auto-fit, minmax(220px, 1fr))' gap={6}>
        {templates &&
          templates.map(({ id, name, displayMode, updatedAt }) => (
            <TemplatesCards
              key={id}
              name={name}
              displayMode={displayMode}
              id={id}
              updatedAt={updatedAt}
            />
          ))}
      </Grid>
      {/* <Center p={4}>
        {templates &&
          templates.map(({ id, name, displayMode, updatedAt }) => (
            <TemplatesCards
              key={id}
              name={name}
              displayMode={displayMode}
              id={id}
              updatedAt={updatedAt}
            />
          ))}
      </Center> */}
    </>
  );
};

export default TemplatesCardContainer;
