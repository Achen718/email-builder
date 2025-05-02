'use client';
import Link from 'next/link';
import { HStack, Text, useColorModeValue } from '@chakra-ui/react';

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

const DesktopNav = ({ navItems }: DesktopNavProps) => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Text
            fontWeight='medium'
            color={textColor}
            data-testid={`nav-item-${item.label.toLowerCase()}`}
          >
            {item.label}
          </Text>
        </Link>
      ))}
    </HStack>
  );
};

export default DesktopNav;
