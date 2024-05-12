import { AbiRegistry, SmartContract, Address } from '@multiversx/sdk-core/out';
import json from '@/abi/contract.abi.json';

const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address(process.env.NEXT_PUBLIC_LOCKI_SMART_CONTRACT_ADDRESS || ''),
  abi
});
