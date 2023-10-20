import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core/out';
import { lockiSmartContractAddress } from '@/config';
import json from '@/abi/contract.abi.json';

const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address(lockiSmartContractAddress),
  abi
});
