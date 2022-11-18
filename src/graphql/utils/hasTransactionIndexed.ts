import { HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedRequest } from 'graphql/generated/types';
import { toast } from 'react-hot-toast';
import Client from 'utils/apolloClient';

const hasTxBeenIndexed = async (request: HasTxHashBeenIndexedRequest) => {
  const result = await Client.query({
    query: HasTxHashBeenIndexedDocument,
    variables: {
      request,
    },
    fetchPolicy: 'network-only',
  });

  return result.data.hasTxHashBeenIndexed;
};
export const pollUntilIndexed = async (input: { txHash: string } | { txId: string }) => {
  try {
    while (true) {
      const response = await hasTxBeenIndexed(input);

      if (response.__typename === 'TransactionIndexedResult') {
        if (response.metadataStatus) {
          if (response.metadataStatus.status === 'SUCCESS') {
            return response;
          }

          if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
            throw new Error(response.metadataStatus.status);
          }
        } else {
          if (response.indexed) {
            return response;
          }
        }

        // sleep for a second before trying again
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // it got reverted and failed!
        throw response;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
