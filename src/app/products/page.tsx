'use client';

import DataGrid from '@/components/DataGrid/DataGrid';
import { STATUS_PROGRESS_MAP } from '@/constants/products';
import { useProducts } from '@/hooks/useProducts';
import { DataGridItemsOptions } from '@/libs/types';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import moment from 'moment';

const pendingProcessOptions: DataGridItemsOptions[] = [
  {
    header: 'Filename',
    name: 'filename',
    getData: (item: any) =>
      (item?.filename || '').replaceAll('.py', '').replaceAll('.blend', '')
  },
  {
    header: 'Status',
    name: 'processingStatus',
    getData: (item: any) =>
      STATUS_PROGRESS_MAP[item?.processingStatus || ''].label
  },
  {
    header: 'Created Date',
    name: 'createdAt',
    getData: (item: any) =>
      moment(item.createdAt).local().format('YYYY-MM-DD HH:mm')
  },
  {
    header: 'View Details',
    customCell: (handlers: any, item: any) => (
      <p
        onClick={handlers.onclick.bind(null, item)}
        className='text-blue-400 cursor-pointer'
      >
        View Details
      </p>
    )
  }
];

export default function Products() {
  const router = useRouter();
  const { tokenLogin } = useGetLoginInfo();
  const { getPendingProcesses } = useProducts(
    tokenLogin?.nativeAuthToken || ''
  );
  const [pendingProcesses, setPendingProcess] = useState([]);

  const navigateToNewProductPage = async () => {
    router.push('/products/new');
  };

  const fetchPendingProcess = async () => {
    const pendingProcessData = await getPendingProcesses();
    console.log('pendingProcessData', pendingProcessData);
    if (pendingProcessData.status === 'Success') {
      setPendingProcess(pendingProcessData.data.products);
    }
  };

  useEffect(() => {
    fetchPendingProcess();
  }, []);

  const handleItemClick = (item: any) => {
    router.push(
      `/products/new?processedId=${item.id}&filename=${item.filename}&type=${item.type}&exportOption=${item.exportOption}`
    );
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
      {pendingProcesses.length > 0 ? (
        <div>
          <DataGrid
            items={pendingProcesses}
            options={pendingProcessOptions}
            handlers={{ onclick: handleItemClick }}
          />
        </div>
      ) : (
        <div className='card m-4 p-4 text-center text-gray-500'>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className='text-4xl text-orange-400'
          />
          <p>
            You do not have any products that are to be minted or minting. Click{' '}
            <Link href='/products/new'>here</Link> to mint new product.
          </p>
        </div>
      )}
    </div>
  );
}
