'use client';

import { useWhitelistUsers } from '@/hooks/useWhitelistUsers';
import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

export default function Admin() {
  const { getUserWhitelisted, addUserWhitelist, removeUserWhitelist } = useWhitelistUsers();
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [result, setResult] = useState('');

  const handleisAddressWhitelisted = async () => {
    setResult('');
    const isAddressWhitelisted = await getUserWhitelisted(whitelistAddress);
    if (isAddressWhitelisted) {
      setResult('The above address is whitelisted');
    } else {
      setResult('The above address is not whitelisted');
    }
  };

  const handleAddAddressWhitelisted = async () => {
    try {
      setResult('');
      await addUserWhitelist(whitelistAddress, window.location.pathname);
      setResult('Succesfully added the address to the whitelist');
    } catch (error: any) {
      console.log('error', error);
      setResult(`Failed to whitelist address with error: ${error.message}`);
    }
  };

  const handleRemoveAddressWhitelisted = async () => {
    try {
      setResult('');
      await removeUserWhitelist(whitelistAddress, window.location.pathname);
      setResult('Successfully removed the address from the whitelist');
    } catch (error: any) {
      console.log('error', error);
      setResult(`Failed to remove the address with error: ${error.message}`);
    }
  }

  return (
    <div className='px-4 pt-2'>
      <div className='flex flex-row w-full p-2.5 text-white'>
        <form
          className='flex flex-col w-1/2 pr-2 overflow-scroll no-scroll'
          style={{ maxHeight: 'calc(100vh - 170px)' }}
        >
          <h1 className='mb-5'>Admin Page</h1>
          <Label htmlFor='whitelistAddress' className='text-white mb-2'>
            Enter address and check if it is whitelisted
          </Label>
          <TextInput
            type='text'
            id='whitelistAddress'
            placeholder='Enter address'
            className='mb-5'
            value={whitelistAddress}
            onChange={(e: any) => setWhitelistAddress(e.target.value)}
          />
          <div className='mt-5 flex flex-row gap-4'>
              <Button
                gradientDuoTone='purpleToBlue'
                onClick={handleisAddressWhitelisted}
                isProcessing={false}
              >
                Check if address is whitelisted
              </Button>
              <Button
                gradientDuoTone='greenToBlue'
                onClick={handleAddAddressWhitelisted}
                isProcessing={false}
              >
                Add address to the whitelist
              </Button>
              <Button
                gradientDuoTone='redToYellow'
                onClick={handleRemoveAddressWhitelisted}
                isProcessing={false}
              >
                Remove address to the whitelist
              </Button>
            </div>
        </form>
      </div>
      <p className='text-white text-lg'>{result}</p>
    </div>
  );
}
