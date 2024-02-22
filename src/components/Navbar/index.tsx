'use client';

import React from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';
import {
  faNewspaper,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { dAppName } from '@/config';
import { routeNames } from '@/routes';
import Link from 'next/link';
import Image from 'next/image';

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  return (
    <BsNavbar className='bg-[#131314] border-b border-[#14154A] px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          href={isLoggedIn ? routeNames.profile : routeNames.home}
        >
          <Image
            src='/assets/img/multiversx.svg'
            className='multiversx-logo'
            width={100}
            height={100}
            alt='MultiversX'
          />
          <span className='dapp-name text-muted'>{dAppName}</span>
        </Link>

        <Nav className='ml-auto'>
          {isLoggedIn && (
            <>
              <NavItem>
                <button className='btn btn-link' onClick={handleLogout}>
                  Close
                </button>
              </NavItem>
            </>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};
