import { AbiRegistry, Address, AddressValue, ContractFunction } from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import {
  QueryRunnerAdapter,
  SmartContractQueriesController
} from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import json from '@/abi/whitelist.abi.json';
import { whitelistSmartContractAddress } from '@/config';
import { useCallback, useState } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { whitelistSmartContract } from '@/libs/smartContracts/whitelistSmartContract';
import { signAndSendTransactions } from '@/libs/utils/signAndSendTransactions';

const ADD_WHITELIST_TRANSACTION_INFO = {
  processingMessage: 'Processing add whitelist transaction',
  errorMessage: 'An error has occured during adding user to whitelist',
  successMessage: 'Add user to whitelist transaction successful'
};

const REMOVE_WHITELIST_TRANSACTION_INFO = {
  processingMessage: 'Processing remove whitelist transaction',
  errorMessage: 'An error has occured during removing user to whitelist',
  successMessage: 'Remove user to whitelist transaction successful'
};

export const useWhitelistUsers = () => {
  const [addWhitelistSessionId, setAddWhitelistSessionId] = useState(sessionStorage.getItem('addWhitelistTransaction'));
  const [removeWhitelistSessionId, setRemoveWhitelistSessionId] = useState(sessionStorage.getItem('removeWhitelistTransaction'));
  const { address } = useGetAccount();
  const { network } = useGetNetworkConfig();
  const abi = AbiRegistry.create(json);

  const getUserWhitelisted = useCallback(async (addressGiven?: string) => {
    const apiNetworkProvider = new ApiNetworkProvider(network.apiAddress);

    const queryRunner = new QueryRunnerAdapter({
      networkProvider: apiNetworkProvider
    });

    const controller = new SmartContractQueriesController({
      queryRunner: queryRunner,
      abi: abi
    });

    const query = controller.createQuery({
      contract: whitelistSmartContractAddress,
      function: 'isAddressWhitelisted',
      arguments: [
        new AddressValue(new Address(addressGiven ? addressGiven : address))
      ]
    });
    const response = await controller.runQuery(query);

    const [isAddressWhitelisted] = controller.parseQueryResponse(response);

    return isAddressWhitelisted;
  }, []);

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(addWhitelistSessionId ?? '');
    deleteTransactionToast(removeWhitelistSessionId ?? '');
  };

  const addUserWhitelist = useCallback(async (addressGiven: string, callbackRoute: string) => {
    clearAllTransactions();
    
    const addWhitelistTransaction = whitelistSmartContract.call({
      func: new ContractFunction('addNewAddressToWhitelist'),
      args: [new AddressValue(new Address(addressGiven))],
      caller: new Address(address),
      gasLimit: 5000000,
      chainID: "D",
    });

    const sessionId = await signAndSendTransactions({
      transactions: [addWhitelistTransaction],
      callbackRoute,
      transactionsDisplayInfo: ADD_WHITELIST_TRANSACTION_INFO
    });

    sessionStorage.setItem('addWhitelistTransaction', sessionId);
    setAddWhitelistSessionId(sessionId);
  }, []);

  const removeUserWhitelist = useCallback(async (addressGiven: string, callbackRoute: string) => {
    clearAllTransactions();
    
    const removeWhitelistTransaction = whitelistSmartContract.call({
      func: new ContractFunction('removeAddressToWhitelist'),
      args: [new AddressValue(new Address(addressGiven))],
      caller: new Address(address),
      gasLimit: 5000000,
      chainID: "D",
    });

    const sessionId = await signAndSendTransactions({
      transactions: [removeWhitelistTransaction],
      callbackRoute,
      transactionsDisplayInfo: REMOVE_WHITELIST_TRANSACTION_INFO
    });

    sessionStorage.setItem('removeWhitelistTransaction', sessionId);
    setRemoveWhitelistSessionId(sessionId);
  }, []);

  return { getUserWhitelisted, addUserWhitelist, removeUserWhitelist };
};
