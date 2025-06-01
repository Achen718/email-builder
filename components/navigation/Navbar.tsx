'use client';
import Navbar from './Navbar/index';

export const navItems = [
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Customers', href: '/customers' },
];

const NavbarComponent = () => {
  return (
    <Navbar.Root>
      <div
        style={{
          display: 'flex',
          minHeight: '64px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Navbar.Logo />
        <Navbar.Desktop navItems={navItems} />
        <Navbar.MobileToggle />
        <Navbar.Actions />{' '}
      </div>

      <Navbar.Mobile navItems={navItems} />
    </Navbar.Root>
  );
};

export default NavbarComponent;
