import React from "react";
import { socialMediaLinks } from "../Constants/Constants";

const Footer = () => {
  return (
    <footer className="bg-gray-10">
      <div className="main-container py-5 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialMediaLinks.map((socialLinks) => (
            <a
              key={socialLinks.name}
              href={socialLinks.href}
              className="bg-gray-20 flex justify-center items-center rounded-full h-10 w-10 md:h-12 md:w-12"
            >
              <span className="sr-only">{socialLinks.name}</span>
              <img className="h-6 w-6" src={socialLinks.title} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-primary">
            Powered by:{" "}
            <a href="https://pollens.xyz/" target="_blank" className="text-tertiary" rel="noreferrer">
              Pollens.xyz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
