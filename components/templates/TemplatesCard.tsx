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
import { formatPostedDate } from '@/utils/formatDate';
import { Template } from '@/types/templates';
const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

const TemplatesCard = ({ name, displayMode, id, updatedAt }: Template) => {
  const formattedPostedDate = formatPostedDate(updatedAt);

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
            backgroundImage: `url(${IMAGE})`,
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
            src={IMAGE}
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