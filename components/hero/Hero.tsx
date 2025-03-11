'use client';
import Link from 'next/link';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const Hero = () => {
  const MotionBox = motion.create(Box);
  const bgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.800', 'white');
  const highlightColor = useColorModeValue('#7B61FF', '#9F7AEA');

  return (
    <Box bg={bgColor} w='full' overflow='hidden'>
      <Container
        maxW='container.xl'
        pt={{ base: 20, md: 32 }}
        pb={{ base: 16, md: 24 }}
      >
        {/* Small highlight badge */}
        <HStack
          mb={8}
          mx='auto'
          maxW='max-content'
          bg={useColorModeValue('gray.100', 'gray.800')}
          rounded='full'
          px={4}
          py={2}
        >
          <Box rounded='full' bg={highlightColor} w={3} h={3} mr={2} />
          <Text fontWeight='medium' fontSize='sm'>
            Introducing Email Builder
          </Text>
        </HStack>

        {/* Main heading */}
        <Stack spacing={6} textAlign='center' mb={16}>
          <Heading
            as='h1'
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight='bold'
            lineHeight='1.1'
            letterSpacing='tight'
          >
            Build beautiful emails
            <Text as='span' color={highlightColor}>
              without code
            </Text>
          </Heading>

          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color={useColorModeValue('gray.600', 'gray.400')}
            maxW='3xl'
            mx='auto'
          >
            Create responsive email templates with our visual editor. Boost
            engagement and save time with intuitive drag-and-drop building.
          </Text>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify='center'
            mt={6}
          >
            <Button
              size='lg'
              rounded='md'
              px={8}
              bg={highlightColor}
              color='white'
              _hover={{
                bg: useColorModeValue('#6952D4', '#8C69E2'),
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              _active={{
                bg: useColorModeValue('#5B46B7', '#7C5DD0'),
              }}
              fontWeight='medium'
              transition='all 0.2s'
            >
              <Link href='/login'>Get started for free</Link>
            </Button>
            <Button
              size='lg'
              rounded='md'
              px={8}
              fontWeight='medium'
              variant='outline'
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                transform: 'translateY(-2px)',
              }}
            >
              See how it works
            </Button>
          </Stack>
        </Stack>

        {/* Product showcase */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          borderRadius='xl'
          overflow='hidden'
          boxShadow='2xl'
          border='1px'
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Box
            position='relative'
            bg={useColorModeValue('gray.50', 'gray.900')}
            p={{ base: 4, md: 8 }}
          >
            <Image
              src='/dashboard-preview.png'
              alt='Email Builder Interface'
              borderRadius='md'
              objectFit='cover'
              width='100%'
            />
          </Box>
        </MotionBox>

        {/* Feature bullets */}
        <Flex justify='center' wrap='wrap' mt={16} gap={8}>
          {[
            { title: 'Visual editor', desc: 'Drag & drop interface' },
            { title: 'Responsive design', desc: 'Works on all devices' },
            { title: 'Template library', desc: 'Start with pre-built designs' },
            { title: 'Analytics', desc: 'Track performance' },
          ].map((feature, idx) => (
            <Box key={idx} textAlign='center' maxW='180px'>
              <Text fontWeight='bold' fontSize='lg' mb={1}>
                {feature.title}
              </Text>
              <Text
                color={useColorModeValue('gray.600', 'gray.400')}
                fontSize='sm'
              >
                {feature.desc}
              </Text>
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default Hero;
