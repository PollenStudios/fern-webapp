import { Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
<<<<<<< HEAD
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageRoutes } from "../Constants/PageRoutes";

const user = {
  name: "Chelsea Hagon",
  email: "chelsea.hagon@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Calendar", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Directory", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]): any {
  return classes.filter(Boolean).join(" ");
}
=======
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
>>>>>>> b42792a (fix navbar on mobile and desktop)

export default function Navbar(): any {
  return (
    <Disclosure as="nav" className="bg-white shadow-md w-full fixed top-0 z-40">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 gap-8 md:gap-12 items-center justify-center sm:justify-start">
                <h4 className="heading-4 md:heading-3">Pollen</h4>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-full border border-gray-300 bg-white py-1 md:py-2 pl-10 pr-3 text-xs focus:outline-none focus:border-none placeholder-gray-500  focus:text-gray-900 focus:placeholder-gray-400 sm:text-xs"
                    placeholder="Explore"
                    type="search"
                  />
                </div>
              </div>
              <div className=" md:flex  items-center gap-4 pr-2  hidden md:ml-6 md:pr-0">
                <a className="text-gray-700 text-lg font-medium" href="/">
                  Discover
                </a>

<<<<<<< HEAD
                  <a href="#" className="ml-6 inline-flex items-center rounded-full px-6 py-2  bg-primary  text-white ">
                    Connect Wallet
                  </a>
                </div>
=======
                <a href="/" className="ml-6 inline-flex items-center rounded-full px-6 py-2  bg-primary  text-white ">
                  Connect Wallet
                </a>
>>>>>>> b42792a (fix navbar on mobile and desktop)
              </div>
            </div>
          </div>

<<<<<<< HEAD
            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50",
                      "block rounded-md py-2 px-3 text-base font-medium",
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-xs font-medium text-gray-500">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only font-inter">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
=======
          <Disclosure.Panel className="md:hidden flex flex-col p-5 space-y-6">
            <a className="text-gray-700 text-lg font-medium" href="/">
              Discover
            </a>

            <div className="">
              <a href="/" className=" inline-flex items-center rounded-full px-6 py-2  bg-primary  text-white ">
                Connect Wallet
              </a>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
>>>>>>> b42792a (fix navbar on mobile and desktop)
  );
}
