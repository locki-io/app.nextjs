import axios from "axios";

export const useProducts = (nativeAuthToken: string) => {
  async function getPendingProcesses() {
    try {
      const pendingProcessesQueryResponse = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}/process/pending`,
        headers: {
          Authorization: nativeAuthToken
        },
      });

      if (pendingProcessesQueryResponse.status === 200) {
        return { status: 'Success', data: pendingProcessesQueryResponse.data };
      } else {
        throw Error('Error in fetching pending processes');
      }
    } catch (error: any) {
      console.log('error', error);
      return { status: 'Fail', error: error.message, data: {} };
    }
  }

  return { getPendingProcesses };
};