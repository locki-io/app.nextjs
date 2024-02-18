'use client';

import {
  apiTimeout,
  sampleAuthenticatedDomains,
  walletConnectV2ProjectId
} from '@/config';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider';
import { AxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext';
import {
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList
} from '@/components';
import { routeNames } from '@/routes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor
        authenticatedDomains={sampleAuthenticatedDomains}
      >
        <DappProvider
          environment={EnvironmentsEnum.devnet}
          customNetworkConfig={{
            name: 'customConfig',
            apiTimeout,
            walletConnectV2ProjectId
          }}
          dappConfig={{
            isSSR: true,
            shouldUseWebViewProvider: true,
            logoutRoute: routeNames.unlock
          }}
          customComponents={{
            transactionTracker: {
              props: {
                onSuccess: (sessionId: string) => {
                  console.log(`Session ${sessionId} successfully completed`);
                },
                onFail: (sessionId: string, errorMessage: string) => {
                  console.log(`Session ${sessionId} failed. ${errorMessage ?? ''}`);
                }
              }
            }
          }}
        >
          <AxiosInterceptorContext.Listener />
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />
          <>{children}</>
        </DappProvider>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
}
