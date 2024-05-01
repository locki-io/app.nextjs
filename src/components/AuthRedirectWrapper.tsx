'use client';

import React, { PropsWithChildren } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { useRouter } from 'next/navigation';
import { routeNames } from '@/routes';
import { useWhitelistUsers } from '@/hooks/useWhitelistUsers';

export const AuthRedirectWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useGetIsLoggedIn();
  const router = useRouter();
  const { getUserWhitelisted } = useWhitelistUsers();

  if (isLoggedIn) {
    (async () => {
      const isUserWhitelisted = await getUserWhitelisted();
      console.log('isUserWhitelisted', isUserWhitelisted);
      router.push(routeNames.profile);
      return null;
    })();
  } else {
    return <>{children}</>;
  }
};
