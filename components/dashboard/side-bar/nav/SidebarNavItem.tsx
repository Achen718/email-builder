import { Box, Flex, Icon, FlexProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import NextLink from 'next/link';

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string;
  href: string;
}

const SidebarNavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <Box
      as={NextLink}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export default SidebarNavItem;
