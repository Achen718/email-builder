'use client';
import NextLink from 'next/link';
import {
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
  Image,
} from '@chakra-ui/react';
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
  console.log(isDefault);
  return (
    <>
      <LinkBox
        as='article'
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius='lg'
      >
        <Card>
          <CardBody>
            <Image
              // add Thumbnail and default thumbnail
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
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
