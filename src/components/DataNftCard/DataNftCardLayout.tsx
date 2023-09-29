import React from 'react';
import { Actions } from '../DataNftCard/Actions/Actions';

export const DataNftCardLayout = ({ children }: React.PropsWithChildren) => {
    return (
                <div className='card-body text-center p-4 '>
                  <Actions />
                </div>
            );
        };