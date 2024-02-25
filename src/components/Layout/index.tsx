'use client';

import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import { routeNames, routes } from '@/routes';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../Navbar';
import Footer from '../Footer';
import { Sidebar } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import { Flowbite } from 'flowbite-react';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';

const customTheme: CustomFlowbiteTheme = {
  sidebar: {
    root: {
      base: 'b-[#141414]',
      inner:
        'bg-gradient-to-b from-[#141414] to-[#151516] text-white h-full overflow-y-auto overflow-x-hidden py-4'
    },
    item: {
      base: 'flex items-center justify-center rounded-lg p-2 px-5 text-base font-normal text-white hover:bg-[#141444]',
      active: 'bg-[#141444]',
      icon: {
        base: 'h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-white',
        active: 'text-white'
      }
    },
    "itemGroup": {
      "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
  }
};

export const LayoutFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-light d-flex flex-column flex-fill wrapper'>
      <Navbar />
      <div className='d-flex flex-column flex-grow-1'>
        <>{children}</>
      </div>
      <Footer />
    </main>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const query = useSearchParams();
  const { isLoggedIn } = useGetLoginInfo();

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <AuthenticatedRoutesWrapper
        routes={routes}
        unlockRoute={`${routeNames.unlock}${query}`}
      >
        <main className='bg-light d-flex flex-column flex-fil wrapper'>
          <Navbar />
          <div
            className='d-flex flex-row'
            style={{ height: 'calc(100vh - 60px)' }}
          >
            <Sidebar aria-label='Default sidebar example' className='w-40'>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  {routes
                    .filter((route) => route.showInSidebar && !!route.authenticatedRoute === isLoggedIn)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((route) => (
                      <Sidebar.Item
                        key={route.title}
                        href={route.path}
                        icon={route.icon}
                      >
                        {route.title}
                      </Sidebar.Item>
                    ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
            <div
              className='bg-profile bg-cover d-flex flex-column overflow-y-scroll'
              style={{ width: 'calc(100vw - 10rem)' }}
            >
              <>{children}</>
            </div>
          </div>
          {/* <Footer /> */}
        </main>
      </AuthenticatedRoutesWrapper>
    </Flowbite>
  );
};
