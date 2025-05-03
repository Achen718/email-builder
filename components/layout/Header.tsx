import { useAppSelector } from '@/lib/hooks/hooks';

const Header = () => {
  const { currentUser, authLoading } = useAppSelector((state) => state.auth);

  console.log(currentUser, authLoading);

  return <header>Some header</header>;
};

export default Header;
