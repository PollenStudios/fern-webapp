import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';

import type { ChangeEvent } from 'react';

import { Button } from '../atoms/Buttons';
import { WalletContext } from 'store/WalletContextProvider';
import ProfileDropdown from '../ProfileDropdown';
import { PageRoutes } from 'utils/config';

import F3RN from 'Assets/Images/fernLogo.svg';
import { Loader } from '../atoms/Loader';
import { LoginModal } from '../Modal/LoginModal';

export default function Navbar(): any {
  const {
    isLoggedInState: { isLoggedIn, loading: loadingIsLoggedIn },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const [query, setQuery] = useState<string>();

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.replace(`/search?q=${query}&type=publications`);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setQuery(keyword);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConnectWallet = () => {
    setIsLoading(true);
  };

  return (
    <>
      <LoginModal openModal={isLoading} setIsLoading={setIsLoading} />
      <Disclosure as="nav" className="bg-white drop-shadow-3xl w-full fixed top-0 z-40">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 -right-2  flex items-center md:hidden">
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
                <div className="flex flex-grow  gap-0  lg:gap-10 items-center justify-center sm:justify-start">
                  <a href="/discover?sortBy=Latest" className="w-24 h-20">
                    {/* <h4 className="heading-4">{config.appName}</h4> */}
                    <img className="w-3/4 md:w-full h-full" src={F3RN} alt="F3RN" />
                  </a>
                  <div className="min-w-0 flex-1  xl:col-span-6">
                    <div className="flex items-center px-4 md:px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                      <div className="w-full">
                        <label htmlFor="search" className="sr-only font-inter">
                          Explore
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="md:h-5 md:w-5 h-4 w-4 -ml-7 md:ml-0 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <form className="-ml-7 md:ml-0" onSubmit={handleSubmit}>
                            <input
                              id="search"
                              name="search"
                              className="block w-11/12 sm:w-3/4 md:w-full lg:w-1/2 paragraph-3 rounded-full border border-gray-300 bg-white py-1.5 md:py-2 pl-10 pr-3 text-xs placeholder-gray-500 focus:border-gray-500 focus:text-primary  focus:outline-none focus:ring-1 focus:ring-gray-100 sm:text-xs "
                              placeholder="Explore feed..."
                              type="search"
                              onChange={e => handleSearch(e)}
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" md:flex  items-center gap-8 lg:gap-10 pr-2  hidden md:ml-6 md:pr-0">
                  <Link to={PageRoutes.DISCOVERY} className="text-gray-700 text-lg font-medium">
                    Discover
                  </Link>
                  {isLoggedIn && currentProfile?.artistApprovalStatus === 'approved' && (
                    <Link to={PageRoutes.UPLOAD_ART} className="text-gray-700 text-lg font-medium">
                      Create
                    </Link>
                  )}

                  {isLoggedIn ? (
                    <ProfileDropdown />
                  ) : (
                    <>
                      {isLoading ? (
                        <div className="bg-primary min-w-[118px] py-2 px-6 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
                          <Loader />
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          disabled={loadingIsLoggedIn}
                          additionalClasses={loadingIsLoggedIn ? 'cursor-not-allowed' : ''}
                          name="Login"
                          onClick={handleConnectWallet}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden flex flex-col p-5 space-y-6 ">
              <Link to={PageRoutes.DISCOVERY} className="text-gray-700 text-lg font-medium">
                Discover
              </Link>
              {isLoggedIn && currentProfile?.artistApprovalStatus === 'approved' && (
                <Link to={PageRoutes.UPLOAD_ART} className="text-gray-700 text-lg font-medium">
                  Create
                </Link>
              )}

              <div className="w-48">
                {isLoggedIn ? (
                  <ProfileDropdown />
                ) : (
                  <>
                    {isLoading ? (
                      <div className="bg-primary w-[80px] py-2 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
                        <Loader />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        disabled={loadingIsLoggedIn}
                        additionalClasses={loadingIsLoggedIn ? 'cursor-not-allowed' : ''}
                        name="Login"
                        onClick={handleConnectWallet}
                      />
                    )}
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
