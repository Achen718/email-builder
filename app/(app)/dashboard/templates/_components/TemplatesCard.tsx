'use client';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  LinkOverlay,
  LinkBox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
import { Template } from '@/types/templates';

type TemplatesCardProps = Template & {
  onDelete?: () => void;
};

const TemplatesCard = ({
  name,
  displayMode,
  id,
  updatedAt,
  thumbnail,
  isDefault,
  onDelete,
}: TemplatesCardProps) => {
  const formattedPostedDate = formatDate(updatedAt);
  return (
    <>
      <LinkBox
        as='article'
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius='lg'
      >
        <Card>
          <CardBody>
            <Box
              position='relative'
              height='200px'
              width='100%'
              borderRadius='lg'
              overflow='hidden'
              mb={4}
            >
              <Image
                src={thumbnail || '/placeholder.jpg'}
                fill
                alt='Green double couch with wooden legs'
              />
            </Box>
            <Stack mt='6' spacing='3'>
              <Text
                color={'gray.500'}
                fontSize={'sm'}
                textTransform={'uppercase'}
              >
                {displayMode}
              </Text>
              <Heading size='md'>
                <LinkOverlay as={NextLink} href={`templates/${id}`}>
                  {name}
                </LinkOverlay>
              </Heading>
              <Text>Last updated: {formattedPostedDate}</Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Menu>
              <MenuButton as={Button}>Actions</MenuButton>
              <MenuList>
                <MenuItem as={NextLink} href={`templates/${id}`}>
                  Edit
                </MenuItem>
                <MenuItem>Duplicate</MenuItem>
                {!isDefault && (
                  <MenuItem onClick={onDelete} color='red.500'>
                    Delete
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </CardFooter>
        </Card>
      </LinkBox>
    </>
  );
};
export default TemplatesCard;
