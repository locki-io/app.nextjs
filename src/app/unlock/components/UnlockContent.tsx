'use client';

import React from 'react';
import { routeNames } from '@/routes';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
  OperaWalletLoginButton,
  XaliasLoginButton,
} from '@/components';

export const UnlockContent = () => {
  const commonProps = {
    callbackRoute: routeNames.profile,
    nativeAuth: {
      apiUrl: 'https://devnet-api.multiversx.com',
      expirySeconds: 60 * 60 * 24,
      blockHashShard: 0
    }
  };

  return (
    <main className='mt-5'>
      <div className='home d-flex flex-fill align-items-center'>
        <div className='m-auto' data-testid='unlockPage'>
          <div className='card my-4 text-center'>
            <div className='card-body py-4 px-2 px-sm-2 mx-lg-4'>
              <h4 className='mb-4'>Login</h4>
              <p className='mb-4'>pick a login method</p>

              <ExtensionLoginButton
                loginButtonText='Extension'
                {...commonProps}
              />

              <WebWalletLoginButton
                loginButtonText='Web wallet'
                data-testid='webWalletLoginBtn'
                {...commonProps}
              />
              <LedgerLoginButton
                loginButtonText='Ledger'
                className='test-class_name'
                {...commonProps}
              />
              <OperaWalletLoginButton
                loginButtonText='Opera Crypto Wallet'
                {...commonProps}
              />

              <XaliasLoginButton
                loginButtonText='xAlias'
                data-testid='xAliasLoginBtn'
                {...commonProps}
              />
              <WalletConnectLoginButton
                loginButtonText='xPortal'
                {...commonProps}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
