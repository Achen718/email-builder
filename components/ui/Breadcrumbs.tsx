'use client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = useMemo(
    () => pathname.split('/').filter((path) => path),
    [pathname]
  );

  return (
    <Breadcrumb>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

        return (
          <BreadcrumbItem key={href}>
            <BreadcrumbLink as={NextLink} href={href}>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
