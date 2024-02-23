'use client';

import { Label, Textarea, TextInput, Button } from 'flowbite-react';
import { useGeneratePreview } from '@/hooks/useGeneratePreview';
import { useState } from 'react';

export default function NewProduct() {
  const { generatePreview } = useGeneratePreview();
  const [name, setName] = useState('');
  const [script, setScript] = useState('');

  const handleGeneratePreview = async () => {
    try {
      const generatePreviewResponse = await generatePreview(name, script);
    } catch (error) {
      console.error('error', error);
    }
  }
  return (
    <div className='w-full p-5 text-white'>
      <h1 className='mb-5'>Create New Product</h1>
      <Label htmlFor='filename' className='text-white mb-2'>
        Name
      </Label>
      <TextInput
        type='text'
        id='filename'
        placeholder='Enter the name of the NFT'
        className='mb-5'
        value={name}
        onChange={(e: any) => setName(e.target.value)}
      />
      <div className='mb-2 block'>
        <Label htmlFor='script' value='Script' className='text-white' />
      </div>
      <Textarea
        id='script'
        placeholder='paste your script to generate preview and mint as DataNft'
        required
        rows={20}
        value={script}
        onChange={(e: any) => setScript(e.target.value)}
      />
      <div className='flex justify-end mt-5'>
        <Button gradientDuoTone='purpleToBlue' onClick={handleGeneratePreview}>Generate Preview</Button>
      </div>
    </div>
  );
}
