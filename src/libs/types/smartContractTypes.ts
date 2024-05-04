export interface TransactionsDisplayInfoType {
  processingMessage: string;
  errorMessage: string;
  successMessage: string;
}

export interface CallTransactionProps {
  endpointName: string;
    endpointArgs?: any[];
    callerAddress: string;
    gasLimit?: number;
    chainID?: string;
    callbackRoute: string;
    transactionsDisplayInfo: TransactionsDisplayInfoType;
}