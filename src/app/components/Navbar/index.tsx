import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { Disclosure } from '@headlessui/react';

import { Link } from 'react-router-dom';

import { Button } from '../atoms/Buttons';
import { useContext } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import ProfileDropdown from '../ProfileDropdown';
import { PageRoutes } from 'utils/config';

export default function Navbar(): any {
  const {
    connectToBrowserWallets,
    isLoggedInState: { isLoggedIn, loading: loadingIsLoggedIn },
    hasProfileState: { hasProfile },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);
  return (
    <Disclosure as="nav" className="bg-white drop-shadow-3xl w-full fixed top-0 z-40">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 focus:bg-gray-200 focus:text-white ">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6 text-black" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6  text-black" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 gap-8 lg:gap-12 items-center justify-center sm:justify-start">
                <Link to={PageRoutes.HOMEPAGE}>
                  <h4 className="heading-4">F3RN</h4>
                </Link>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only font-inter">
                        Explore
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block w-3/4 lg:w-1/2 paragraph-3 rounded-full border border-gray-300 bg-white py-2 pl-10 pr-3 text-xs placeholder-gray-500 focus:border-gray-500 focus:text-primary  focus:outline-none focus:ring-1 focus:ring-gray-100 sm:text-xs "
                          placeholder="Explore"
                          type="search"
                          onChange={e => console.log(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" md:flex  items-center gap-8 lg:gap-10 pr-2  hidden md:ml-6 md:pr-0">
                <Link to={PageRoutes.DISCOVERY} className="text-gray-700 text-lg font-medium">
                  Discover
                </Link>
                {isLoggedIn && currentProfile?.approvalStatus === 'APPROVED' && (
                  <Link to={PageRoutes.UPLOAD_ART} className="text-gray-700 text-lg font-medium">
                    Create
                  </Link>
                )}

                {isLoggedIn ? (
                  <ProfileDropdown />
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={loadingIsLoggedIn}
                    additionalClasses={loadingIsLoggedIn ? 'cursor-not-allowed' : ''}
                    name={
                      loadingIsLoggedIn
                        ? 'Connecting...'
                        : !hasProfile && localStorage.getItem('accessToken')
                        ? 'Connected'
                        : 'Connect Wallet'
                    }
                    onClick={() => connectToBrowserWallets()}
                  />
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden flex flex-col p-5 space-y-6 ">
            <Link to={PageRoutes.DISCOVERY} className="text-gray-700 text-lg font-medium">
              Discover
            </Link>
            {isLoggedIn && currentProfile?.approvalStatus === 'APPROVED' && (
              <Link to={PageRoutes.UPLOAD_ART} className="text-gray-700 text-lg font-medium">
                Create
              </Link>
            )}

            <div className="w-48">
              {isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  disabled={loadingIsLoggedIn}
                  additionalClasses={loadingIsLoggedIn ? 'cursor-not-allowed' : ''}
                  name={loadingIsLoggedIn ? 'Connecting...' : 'Connect Wallet'}
                  onClick={() => connectToBrowserWallets()}
                />
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
