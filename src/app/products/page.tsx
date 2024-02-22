'use client';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';

export default function Products() {
  const navigateToNewProductPage = async () => {
    console.log('navigate to new product page');
  };

  return (
    <div className='w-full p-5 text-white'>
      <Button
        gradientDuoTone='tealToLime'
        onClick={navigateToNewProductPage}
        className='mb-4'
      >
        Create New Product
      </Button>
      <h1>Products to be minted.</h1>
      <div className='card m-4 p-4 text-center text-gray-500'>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className='text-4xl text-orange-400'
        />
        <p>
          You do not have any products that are to be minted or minting. Click{' '}
          <a href='/products/new'>here</a> to mint new product.
        </p>
      </div>
    </div>
  );
}
