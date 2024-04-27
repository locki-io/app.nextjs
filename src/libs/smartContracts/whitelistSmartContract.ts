import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core/out';
import { whitelistSmartContractAddress } from '@/config';
import json from '@/abi/whitelist.abi.json';

const abi = AbiRegistry.create(json);

export const whitelistSmartContract = new SmartContract({
  address: new Address(whitelistSmartContractAddress),
  abi
});
