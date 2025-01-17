'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';

const Header = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading } = useAppSelector((state) => state.auth);

  console.log(currentUser, loading);

  return <header>Some header</header>;
};

export default Header;
