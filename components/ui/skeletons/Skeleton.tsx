'use client';
import { Stack, Skeleton } from '@chakra-ui/react';

const BaseSkeleton = () => {
  return (
    <Stack>
      <Skeleton height='20px' />
      <Skeleton height='20px' />
      <Skeleton height='20px' />
    </Stack>
  );
};

export default BaseSkeleton;
