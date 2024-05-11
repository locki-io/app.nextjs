import json from '@/abi/whitelist.abi.json';
import { AccountInfoSliceNetworkType } from '@multiversx/sdk-dapp/types';
import { BaseSmartContract } from './baseSmartContract';

export class WhitelistSmartContract extends BaseSmartContract {
  constructor(network: AccountInfoSliceNetworkType) {
    super(json, process.env.NEXT_PUBLIC_WHITELIST_SMART_CONTRACT_ADDRESS || '', network);
  }
}
