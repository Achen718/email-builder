import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import SidebarNavItem from './SidebarNavItem';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

// TODO: Move external
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/dashboard' },
  { name: 'Templates', icon: FiTrendingUp, href: '/dashboard/templates' },
  { name: 'Explore', icon: FiCompass, href: '/dashboard' },
  { name: 'Favourites', icon: FiStar, href: '/dashboard' },
  { name: 'Settings', icon: FiSettings, href: '/dashboard/settings' },
];

const SidebarContent = () => {
  return (
    <>
      {LinkItems.map((link) => (
        <SidebarNavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </SidebarNavItem>
      ))}
    </>
  );
};

export default SidebarContent;
