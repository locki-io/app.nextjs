'use client';

import { DataGridItemsOptions } from '@/libs/types';
import { Table } from 'flowbite-react';

interface DataGridProps {
  items: any[];
  options: DataGridItemsOptions[];
  handlers?: any;
}

export default function DataGrid({ items, options, handlers }: DataGridProps) {
  return (
    <Table>
      <Table.Head>
        {options.map((option) => (
          <Table.HeadCell key={option.name}>{option.header}</Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className='divide-y'>
        {items.map((item) => (
          <Table.Row
            key={item.id}
            className='bg-white dark:border-gray-700 dark:bg-gray-800'
          >
            {options.map((option) => (
              <Table.Cell key={item[option.name || '']}>
                {option?.customCell
                  ? option.customCell(handlers, item)
                  : option.getData
                  ? option.getData(item)
                  : item[option.name || '']}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
