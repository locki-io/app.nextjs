import axios from 'axios';

export const useGeneratePreview = (nativeAuthToken: string) => {
  async function generatePreview(
    filename: string,
    script: string,
    inputOption: string,
    exportOption: string,
    processedId: number | null,
  ) {
    try {
      const generatePreviewResponse = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}/generatePreview`,
        params: {
          filename: filename.replaceAll(' ', '').trim(),
          inputOption,
          exportOption,
          processedId
        },
        headers: {
          Authorization: nativeAuthToken
        },
        data: script
      });
      return generatePreviewResponse.data;
    } catch (error: any) {
      console.error('error', error);
      return { status: 'error', msg: error.message };
    }
  }

  async function getSignedUrl(filename: string) {
    try {
      return await axios({
        method: 'GET',
        url: `${
          process.env.NEXT_PUBLIC_BASE_API_URL || ''
        }/scriptUploadLink?filename=${filename}`
      });
    } catch (error: any) {
      console.error('error', error);
      return { status: 'error', msg: error.message };
    }
  }

  async function uploadFileWithLink(link: string, file: any) {
    try {
      return await axios({
        method: 'PUT',
        url: link,
        data: file,
        headers: {
          'Content-Type': file.type,
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error: any) {
      console.error('error', error);
      return { status: 'error', msg: error.message };
    }
  }

  async function updateProcessingStatus(
    processedId: number,
    type: string,
    status: string,
  ) {
    try {
      await axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}/process/status`,
        data: { processedId, type, status },
        headers: {
          Authorization: nativeAuthToken
        }
      });
    } catch (error: any) {
      console.error('error', error);
      return { status: 'error', msg: error.message };
    }
  }

  return { generatePreview, getSignedUrl, uploadFileWithLink, updateProcessingStatus };
};
