'use client';

import { toastSuccess } from '@/libs/utils';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import axios from 'axios';
import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

export default function Blacklist() {
  const { address } = useGetAccount();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const sendDiscordMessage = async () => {
    let isValid = true;
    if (!fullName) {
      setFullNameErrorMessage('Full Name is Required');
      isValid = false;
    } else {
      setFullNameErrorMessage('');
    }

    if (!email) {
      setEmailErrorMessage('Email is Required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErrorMessage('Invalid Email Address');
      isValid = false;
    } else {
      setEmailErrorMessage('');
    }

    try {
      if (isValid) {
        const sendDiscordMessageResponse = await axios(
          process.env.NEXT_PUBLIC_DISCORD_BOT_URL || '',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
              content: `Dear Locki Team. Please whitelist my wallet address to mint awesome 3D assets using Locki. These are my details:
              Address: ${address}
              Full Name: ${fullName}
              Email: ${email}`
            })
          }
        );

        if (sendDiscordMessageResponse.status === 204) {
          toastSuccess(
            'Posted to our discord bot. You will receive an email from us shortly once we whitelist your address.'
          );
        } else {
          throw new Error('Failed to send a message');
        }
      }
    } catch (error) {
      console.log('error occured');
    }
  };
  return (
    <div className='flex justify-center pt-[10vh]'>
      <div className='bg-white p-5 rounded-md flex flex-col justify-center items-center'>
        <div className='mb-4'>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className='text-muted w-20 h-20'
          />
        </div>
        <p>Apologise for the inconvinience. We are not open to public yet.</p>
        <p>
          Please enter your name and email below and send a message to our
          Discord bot to request to whitelist your wallet address.
        </p>
        <Label htmlFor='fullName' className='mt-4'>
          Full Name
        </Label>
        <TextInput
          type='text'
          id='fullName'
          placeholder='Enter your full name'
          className='min-w-[180px]'
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
          color={fullNameErrorMessage ? 'failure' : undefined}
          helperText={
            <>
              <span className='font-medium'>{fullNameErrorMessage}</span>
            </>
          }
        />
        <Label htmlFor='email' className='mt-4'>
          Email
        </Label>
        <TextInput
          type='email'
          id='email'
          placeholder='Enter your Email Address'
          className='min-w-[180px]'
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          color={emailErrorMessage ? 'failure' : undefined}
          helperText={
            <>
              <span className='font-medium'>{emailErrorMessage}</span>
            </>
          }
        />
        <Button
          gradientDuoTone='purpleToBlue'
          onClick={sendDiscordMessage}
          isProcessing={false}
        >
          Request to whitelist your address
        </Button>
      </div>
    </div>
  );
}
