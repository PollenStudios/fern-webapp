import { addBgColor } from "../../Constants/Constants";

export const Button = (props: { variant: string; name: string; type: any }) => {
  const { variant, name, type } = props;

  return (
    <button
      type={type}
      className={`heading-6 inline-flex items-center px-6 py-3 border
       border-${variant === "outline" ? "primary" : "transparent"} text-base font-medium rounded-full shadow-sm ${
        variant === "outline" ? "text-primary" : `text-white ${addBgColor(variant)} focus:outline-none`
      }`}
    >
      {name}
    </button>
  );
};

export const ButtonWithIcon = (props: { variant: string; icon: string; name: string; type: any }) => {
  const { variant, icon, name, type } = props;

  return (
    <button
      type={type}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white 
      ${addBgColor(variant)}  focus:outline-none`}
    >
      <img className="w-6 h-6 rounded-full" src={icon} alt={name} />
      <div className="heading-6">{name}</div>
    </button>
  );
};
