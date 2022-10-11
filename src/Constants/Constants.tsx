import Twitter from "../Assets/Icons/twitter.svg";
import Facebook from "../Assets/Icons/facebook.svg";
import Instagram from "../Assets/Icons/instagram.svg";
import Google from "../Assets/Icons/google.svg";

export const socialMedia = [
  {
    title: Facebook,
    name: "Facebook",
    href: "#",
  },
  {
    title: Instagram,
    name: "Instagram",
    href: "#",
  },
  {
    title: Twitter,
    name: "Twitter",
    href: "https://twitter.com/PollenStudios",
  },
  {
    title: Google,
    name: "Google",
    href: "#",
  },
];

export const addBgColor = (variant: string) => {
  switch (variant) {
    case "primary":
      return "bg-primary";
    case "danger":
      return "bg-red-800";
    case "success":
      return "bg-secondary";
    case "warning":
      return "bg-yellow-500";
    default:
      console.log(`Variant name is incorrect ${variant}.`);
  }
};
