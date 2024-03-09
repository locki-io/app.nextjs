import axios from 'axios';

export const useGeneratePreview = () => {
  async function generatePreview(
    filename: string,
    script: string,
    inputOption: string,
    exportOption: string,
    processedId: number | null,
    nativeAuthToken: string,
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
          Authorization: nativeAuthToken,
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

  return { generatePreview, getSignedUrl, uploadFileWithLink };
};
