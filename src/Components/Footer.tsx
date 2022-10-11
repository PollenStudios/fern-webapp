import { socialMediaLinks } from "../Constants/Constants";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialMediaLinks.map((link) => (
            <a key={link.name} target="_blank" rel="noreferrer" href={link.href} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">{link.name}</span>
              <img src={link.socialIcon} className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-gray-400">&copy; 2020 Your Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
