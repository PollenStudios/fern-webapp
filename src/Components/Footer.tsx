import { socialMediaLinks } from "../Constants/Constants";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialMediaLinks.map((item: socialMediaFooterProps) => (
            <a key={item.name} href={item.href} className=" rounded-full">
              <img src={item.icon} alt={item.name} className="h-6 w-6 " />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-gray-400">&copy; 2022 Pollen Web3, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
