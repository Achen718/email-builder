'use client';
import NextLink from 'next/link';

import {
  Box,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';
import { formatDate } from '@/utils/formatDate';
import { Template } from '@/types/templates';

const TemplatesCard = ({
  name,
  displayMode,
  id,
  updatedAt,
  thumbnail,
}: Template) => {
  const formattedPostedDate = formatDate(updatedAt);

  return (
    <>
      <Box
        as={NextLink}
        href={`templates/${id}`}
        role={'group'}
        p={6}
        maxW={'330px'}
        m={2}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${thumbnail})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={thumbnail}
            alt='#'
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            {displayMode}
          </Text>
          <Heading
            fontSize={'md'}
            as={'h4'}
            fontFamily={'body'}
            fontWeight={500}
          >
            {name}
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'sm'}>
              Last updated: {formattedPostedDate}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
export default TemplatesCard;
