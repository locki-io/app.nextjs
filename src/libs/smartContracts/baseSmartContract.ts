import {
  AbiRegistry,
  Address,
  ContractFunction,
  ResultsParser,
  SmartContract
} from '@multiversx/sdk-core/out';
import { AccountInfoSliceNetworkType } from '@multiversx/sdk-dapp/types';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { signAndSendTransactions } from '../utils/signAndSendTransactions';
import { CallTransactionProps } from '../types';

export class BaseSmartContract {
  public abi: AbiRegistry;
  public contract: SmartContract;
  public networkProvider: ApiNetworkProvider;
  constructor(
    abiJson: any,
    contractAddress: string,
    network: AccountInfoSliceNetworkType
  ) {
    this.abi = AbiRegistry.create(abiJson);
    this.contract = new SmartContract({
      address: new Address(contractAddress),
      abi: this.abi
    });
    this.networkProvider = new ApiNetworkProvider(network.apiAddress);
  }

  async query(endpointName: string, queryArguments: any[]) {
    const endpoint = this.abi.getEndpoint(endpointName);
    const query = this.contract.createQuery({
      func: endpointName,
      args: [...queryArguments]
    });

    const queryResponse = await this.networkProvider.queryContract(query);
    const { values } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpoint
    );
    return values;
  }

  async callTransaction({
    endpointName,
    endpointArgs = [],
    callerAddress,
    gasLimit = 5000000,
    chainID = 'D',
    callbackRoute,
    transactionsDisplayInfo
  }: CallTransactionProps) {
    const addWhitelistTransaction = this.contract.call({
      func: new ContractFunction(endpointName),
      args: endpointArgs,
      caller: new Address(callerAddress),
      gasLimit: gasLimit,
      chainID: chainID,
    });

    const sessionId = await signAndSendTransactions({
      transactions: [addWhitelistTransaction],
      callbackRoute,
      transactionsDisplayInfo,
    });

    return sessionId;
  }
}
