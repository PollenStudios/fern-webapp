import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { profileCardOptions } from "../Constants/Constants";


const ProfileDropdown = () => {
  return (
    <div className="w-[350px] bg-white absolute rounded-md top-16">
      <div className="flex  justify-between px-4 py-6 cursor-pointer">
        <div className="flex items-center">
          <div className="bg-gradient-to-b from-pink-500 to-pink-700 w-12 h-12 rounded-full"></div>
          <h6 className="font-semibold ml-2">Profile</h6>
        </div>

        <ChevronRightIcon className="w-6 text-gray-600" />
      </div>
      <div className="border rounded-lg mx-3 cursor-pointer">
        <div className="hover:bg-gray-10 hover:rounded-t-md">
          <div className="flex justify-between px-2 py-3  ">
            <div>
              <h3 className="heading-6 text-gray-500">Wallet Balance</h3>
              <h2 className="heading-5">0 ETH</h2>
            </div>
            <div className="flex bg-gray-100 px-2 py-0.5 rounded-lg h-fit">
              <p className="text-xs">0x6fDF...8Fa7</p>
              <hr className="w-3 h-3 rounded-full mt-1 ml-1.5 bg-green-500" />
            </div>
          </div>
        </div>

        <div className="hover:bg-gray-10 hover:rounded-b-md">
          <div className="flex justify-between px-2 py-3 ">
            <div>
              <h3 className="heading-6 text-gray-500">Marketplace Balance</h3>
              <h2 className="heading-5">0 ETH</h2>
            </div>
            <ChevronRightIcon className="w-6 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="mt-8 px-4">
        {profileCardOptions.map((item) => (
          <a key={item.option} href="#">
            <div className="flex  justify-between my-6">
              <div className="flex items-center">
                <item.icon className="w-8 h-8 text-black " />

                <h6 className="font-semibold ml-2">{item.option}</h6>
              </div>

              <ChevronRightIcon className="w-6 text-gray-600" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileDropdown;
