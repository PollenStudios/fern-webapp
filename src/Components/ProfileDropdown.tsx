import { ChevronRightIcon, Cog8ToothIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

import { WalletContext } from "../Context/WalletContextProvider";

import { useContext } from "react";
import { Link } from "react-router-dom";

import profileImg from "../Assets/Images/profileImg.png";
import { PageRoutes } from "../Constants/PageRoutes";
import { userData } from "../Constants/Constants";
const ProfileDropdown = () => {
  const { account, walletBalance, setIsLogedin }: any = useContext(WalletContext);
  return (
    <div className="w-full h-screen md:h-auto md:w-[350px] bg-white absolute rounded-md top-[4.5rem] right-0 md:right-2">
      <div className="flex  justify-between px-4 py-6 cursor-pointer">
        <div className="flex items-center">
          <div>
            <img className="w-12 h-12 rounded-full mr-2" src={profileImg} alt="profile-img" />
          </div>
          <h6 className="font-semibold ml-2 truncate">{userData.artistName}</h6>
        </div>

        <ChevronRightIcon className="w-6 text-gray-600" />
      </div>
      <div className="border rounded-lg mx-3 cursor-pointer">
        <div className="hover:rounded-t-md">
          <div className="flex justify-between px-2 py-3  ">
            <div>
              <h3 className="heading-6 text-gray-500">Wallet Balance</h3>
              <h2 className="heading-5">{walletBalance} ETH</h2>
            </div>
            <div className="flex bg-gray-100 px-2 py-0.5 rounded-lg h-fit">
              <p className="text-xs text-clip">{account ? account.slice(0, 5) + "..." + account.slice(38) : ""}</p>
              <hr className="w-3 h-3 rounded-full mt-1 ml-1.5 bg-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to={PageRoutes.SETTINGS}>
          <div className="flex hover:bg-gray-100  justify-between p-4">
            <div className="flex items-center">
              <Cog8ToothIcon className="w-8 h-8 text-black" />

              <h6 className="font-semibold ml-2">Settings</h6>
            </div>

            <ChevronRightIcon className="w-6 text-gray-600" />
          </div>
        </Link>
        <div className="flex hover:bg-gray-100 cursor-pointer justify-between p-4">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-black" />

            <h6 className="font-semibold ml-2">Help</h6>
          </div>

          <ChevronRightIcon className="w-6 text-gray-600" />
        </div>
        <div onClick={() => setIsLogedin(false)} className="flex hover:bg-gray-100 cursor-pointer  justify-between p-4">
          <div className="flex items-center">
            <ArrowLeftOnRectangleIcon className="w-8 h-8 text-black" />

            <h6 className="font-semibold ml-2">Disconnect</h6>
          </div>

          <ChevronRightIcon className="w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
