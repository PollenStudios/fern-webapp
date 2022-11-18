import config, { PageRoutes } from 'utils/config';
import { Link, useNavigate } from 'react-router-dom';
import socialMediaLinks from './socialMediaLinks';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialMediaLinks.map(link => (
            <Link
              key={link.socialIconName}
              target="_blank"
              rel="noreferrer"
              to={link.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{link.socialIconName}</span>
              <img src={link.socialIcon} className="h-6 w-6" aria-hidden="true" alt={link.socialIconName} />
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row gap-x-6">
          <p className="text-center paragraph-2 text-gray-400">
            &copy;{` 2022 ${config.appName} | All rights reserved`}
          </p>
          <p
            className="text-center paragraph-2 text-gray-400 cursor-pointer"
            onClick={() => navigate(PageRoutes.PRIVACY_POLICY)}
          >
            Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
