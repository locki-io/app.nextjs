import axios from 'axios';

export const useGeneratePreview = () => {
  async function generatePreview(filename: string, script: string) {
    try {
      const generatePreviewResponse = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}/generatePreview`,
        params: {
          filename: filename
        },
        data: script
      });
      return generatePreviewResponse.data;
    } catch (error: any) {
      console.error('error', error);
      return { status: 'error', msg: error.message };
    }
  }

  return { generatePreview };
};
