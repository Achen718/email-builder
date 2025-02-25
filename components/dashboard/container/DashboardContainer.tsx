'use client';

const DashboardContainer = ({ children }: { children: React.ReactNode }) => {
  return <section className='fixed w-full'>{children}</section>;
};

export default DashboardContainer;
