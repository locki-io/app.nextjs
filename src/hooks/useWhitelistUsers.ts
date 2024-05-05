import { Address, AddressValue } from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { WhitelistSmartContract } from '@/libs/smartContracts/whitelistSmartContract';

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
  const [addWhitelistSessionId, setAddWhitelistSessionId] = useState('');
  const [removeWhitelistSessionId, setRemoveWhitelistSessionId] = useState('');
  const { address } = useGetAccount();
  const { network } = useGetNetworkConfig();
  const whitelistSmartContract = new WhitelistSmartContract(network);

  useEffect(() => {
    const preAddWhitelistTransactionId = sessionStorage.getItem('addWhitelistTransaction');
    const preRemoveWhitelistTransactionId = sessionStorage.getItem('removeWhitelistTransaction');

    if (preAddWhitelistTransactionId) {
      setAddWhitelistSessionId(preAddWhitelistTransactionId);
    }

    if (preRemoveWhitelistTransactionId) {
      setRemoveWhitelistSessionId(preRemoveWhitelistTransactionId);
    }
  }, []);

  const getUserWhitelisted = useCallback(async (addressGiven?: string) => {
    const isAddressWhitelistedValues = await whitelistSmartContract.query('isAddressWhitelisted', [
      new AddressValue(new Address(addressGiven ? addressGiven : address))
    ]);

    return isAddressWhitelistedValues?.[0] ? isAddressWhitelistedValues?.[0].valueOf() : false;
  }, []);

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(addWhitelistSessionId ?? '');
    deleteTransactionToast(removeWhitelistSessionId ?? '');
  };

  const addUserWhitelist = useCallback(async (addressGiven: string, callbackRoute: string) => {
    clearAllTransactions();

    const addWhitelistSessionId = await whitelistSmartContract.callTransaction({
      endpointName: 'addNewAddressToWhitelist',
      endpointArgs: [new AddressValue(new Address(addressGiven))],
      callerAddress: address,
      chainID: 'D',
      transactionsDisplayInfo: ADD_WHITELIST_TRANSACTION_INFO,
      callbackRoute,
    });

    sessionStorage.setItem('addWhitelistTransaction', addWhitelistSessionId);
    setAddWhitelistSessionId(addWhitelistSessionId);
  }, []);

  const removeUserWhitelist = useCallback(async (addressGiven: string, callbackRoute: string) => {
    clearAllTransactions();

    const removeWhitelistSessionId = await whitelistSmartContract.callTransaction({
      endpointName: 'removeAddressToWhitelist',
      endpointArgs: [new AddressValue(new Address(addressGiven))],
      callerAddress: address,
      chainID: 'D',
      transactionsDisplayInfo: REMOVE_WHITELIST_TRANSACTION_INFO,
      callbackRoute,
    });

    sessionStorage.setItem('removeWhitelistTransaction', removeWhitelistSessionId);
    setRemoveWhitelistSessionId(removeWhitelistSessionId);
  }, []);

  return { getUserWhitelisted, addUserWhitelist, removeUserWhitelist };
};
