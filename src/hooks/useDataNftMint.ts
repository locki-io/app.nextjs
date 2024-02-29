import { DATA_MARSHALL_URL } from '@/config';
import { SftMinter } from '@itheum/sdk-mx-data-nft';

import { Address, Transaction } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account';

export const useDataNftMint = (address: string) => {
  const dataNftMinter = new SftMinter(
    process.env.NEXT_PUBLIC_CHAIN || 'devnet'
  );

  async function mint(
    tokenName: string,
    dataStreamUrl: string,
    dataPreviewUrl: string,
    royalityPercentage: number,
    title: string,
    description: string
  ) {
    try {
      const requirements = await dataNftMinter.viewMinterRequirements(
        new Address(address)
      );
      const antiSpamTax = requirements?.antiSpamTaxValue;
      console.log(
        `dataNftMinter.mint(${new Address(address)}, ${tokenName}, ${
          DATA_MARSHALL_URL[process.env.NEXT_PUBLIC_CHAIN || 'devnet']
        }, ${dataStreamUrl}, ${dataPreviewUrl}, ${
          royalityPercentage * 100
        }, 1, ${title}, ${description}, ${antiSpamTax}, {nftStorageToken: ${
          process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
        }})`
      );

      const mintTransaction: Transaction = await dataNftMinter.mint(
        new Address(address),
        tokenName,
        DATA_MARSHALL_URL[process.env.NEXT_PUBLIC_CHAIN || 'devnet'],
        dataStreamUrl,
        dataPreviewUrl,
        royalityPercentage * 100,
        1,
        title,
        description,
        antiSpamTax,
        {
          nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
        }
      );

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: mintTransaction,
        transactionsDisplayInfo: {
          processingMessage: 'Minting Standard Data NFT',
          errorMessage: 'Data NFT minting error',
          successMessage: 'Data NFT minted successfully'
        },
        redirectAfterSign: false
      });
      console.log('sessionId', sessionId, 'error', error);

      return {
        id: sessionId,
        status: error ? 'error' : 'success',
        msg: error ? error?.message : 'Succesfully Minted Data NFT'
      };
    } catch (error: any) {
      console.log('error', error);
      return { id: null, status: 'error', msg: error.message };
    }
  }

  return { mint };
};
