import { useState } from 'react';
import { smartContract } from './smartContract';
import { Address, ContractFunction, StringValue, U8Value } from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { WalletProvider, WALLET_PROVIDER_DEVNET } from "@multiversx/sdk-web-wallet-provider";

export const useStoreCreatorsDescription = () => {
  const [nonce, setNonce] = useState(0);
  const [description, setDescription] = useState('');
  const { address } = useGetAccount();
  const { network } = useGetNetworkConfig();

  const callContractToStoreDescription = async (
    _nonce: number,
    _description: string
  ) => {
    setNonce(_nonce);
    setDescription(_description);

    const storageTransaction = smartContract.call({
      func: new ContractFunction('storeCreatorDescription'),
      args: [new U8Value(nonce), new StringValue(description)],
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
