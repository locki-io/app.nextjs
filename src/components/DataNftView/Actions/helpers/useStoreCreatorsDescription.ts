import { useState } from 'react';
import { smartContract } from './smartContract';
import { Address, ContractFunction, StringValue, U8Value } from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { WalletProvider, WALLET_PROVIDER_DEVNET } from "@multiversx/sdk-web-wallet-provider";

export const useStoreCreatorsDescription = () => {
  const { address, } = useGetAccount();
  const { network } = useGetNetworkConfig();

  const callContractToStoreDescription = async (
    _sftNonce: number,
    _description: string
  ) => {

    console.log({
      _sftNonce
    })


    const storageTransaction = smartContract.call({
      func: new ContractFunction('storeCreatorDescription'),
      args: [new U8Value(_sftNonce), new StringValue(_description)],
      caller: new Address(address),
      gasLimit: 5000000,
      chainID: "D",
    });
    console.log('storageTransaction', storageTransaction);

    const walletProvider = new WalletProvider(WALLET_PROVIDER_DEVNET);
    await walletProvider.signTransactions([storageTransaction], {callbackUrl: window.location.href});

    const provider = new ProxyNetworkProvider(network.apiAddress);
    const txHash = await provider.sendTransaction(storageTransaction);
    console.log('txHash', txHash);
  };

  return {
    callContractToStoreDescription
  };
};
