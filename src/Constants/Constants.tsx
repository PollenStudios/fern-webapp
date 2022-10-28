import Twitter from "../Assets/Icons/twitter.svg";
import Facebook from "../Assets/Icons/facebook.svg";
import Instagram from "../Assets/Icons/instagram.svg";
import Google from "../Assets/Icons/google.svg";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

import cardImg from "../Assets/Images/artPreview.png";
import { PageRoutes } from "./PageRoutes";

export const socialMediaLinks: socialMediaFooterProps[] = [
  {
    socialIcon: Facebook,
    socialIconName: "Facebook",
    href: "#",
  },
  {
    socialIcon: Instagram,
    socialIconName: "Instagram",
    href: "#",
  },
  {
    socialIcon: Twitter,
    socialIconName: "Twitter",
    href: "https://twitter.com/PollenStudios",
  },
  {
    socialIcon: Google,
    socialIconName: "Google",
    href: "#",
  },
];

//card data

export const userData = {
  img: cardImg,
  artName: "Archaeology kjbjhdsbjhbdh",
  artistName: "@Juliette Hayt Greenberg",
};

export const artworkPlaceHolderData: artworkCardPropsTypes[] = [
  {
    img: userData.img,
    artName: userData.artName,
    artistName: userData.artistName,
    likes: "124",
    share: "33",
  },
  {
    img: userData.img,
    artName: userData.artName,
    artistName: userData.artistName,
    likes: "124",
    share: "33",
  },
  {
    img: userData.img,
    artName: userData.artName,
    artistName: userData.artistName,
    likes: "124",
    share: "33",
  },
];

export const tabsData: tabsDataPropTypes[] = [
  {
    id: 1,
    tabName: "Artworks",
  },
  {
    id: 2,
    tabName: "Artboards",
  },
];

export const profileCardOptions = [
  {
    icon: (props: any) => <Cog8ToothIcon {...props} />,
    option: "Settings",
  },
  {
    icon: (props: any) => <QuestionMarkCircleIcon {...props} />,
    option: "Help",
  },
  {
    icon: (props: any) => <ArrowLeftOnRectangleIcon {...props} />,
    option: "Disconnect",
  },
];

export const IPFS_GATEWAY = "https://lens.infura-ipfs.io/ipfs/";
