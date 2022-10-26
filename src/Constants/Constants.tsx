import Twitter from "../Assets/Icons/twitter.svg";
import Facebook from "../Assets/Icons/facebook.svg";
import Instagram from "../Assets/Icons/instagram.svg";
import Google from "../Assets/Icons/google.svg";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import{QuestionMarkCircleIcon}  from "@heroicons/react/24/outline";
import {ArrowLeftOnRectangleIcon} from "@heroicons/react/24/outline";




import cardImg from "../Assets/Images/artPreview.png";

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

export const artworkPlaceHolderData: artworkCardPropsTypes[] = [
  {
    img: cardImg,
    artName: "Archaeology kjbjhdsbjhbdh",
    artistName: "@Juliette Hayt Greenberg",
    likes: "124",
    share: "33",
  },
  {
    img: cardImg,
    artName: "Archaeology",
    artistName: "@Juliette Hayt Greenberg",
    likes: "124",
    share: "33",
  },
  {
    img: cardImg,
    artName: "Archaeology",
    artistName: "@Juliette Hayt Greenberg",
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
    icon: (props:any) => (<Cog8ToothIcon {...props} />),
    option: "Settings"
  },
  {
    icon: (props:any) => (<QuestionMarkCircleIcon {...props} />),
    option: "Help"
  },
  {
    icon: (props:any) => (<ArrowLeftOnRectangleIcon  {...props}/>),
    option: "Disconnect"
  }
]
