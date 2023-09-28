import React from 'react';
import styles from './datanftboard.module.scss';

export const DataNftBoardLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm border-0'>
            <div className='card-body p-1'>
              <div className='card border-0 bg-primary'>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
