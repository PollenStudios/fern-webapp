import { XMarkIcon } from "@heroicons/react/24/outline";
type ButtonProps = {
  variant: "primary" | "outline" | "danger" | "success" | "warning";
  name: string;
  disabled?: boolean;
  type: "button" | "submit" | "reset" | undefined;
  icon?: string;
  onClick: any;
};

const checkVariant = (variant: string) => {
  switch (variant) {
    case "primary":
      return "bg-primary border-none";
    case "outline":
      return "border-primary text-primary";
    case "danger":
      return "bg-red-800 border-none";
    case "success":
      return "bg-secondary border-none";
    case "warning":
      return "bg-yellow-500 border-none";
    default:
      return "bg-primary border-none";
  }
};

export const Button = ({ variant, name, disabled, type, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`inline-flex items-center rounded-full  px-6 py-3 text-xs heading-6 text-white shadow-sm focus:outline-none scale-100 hover:scale-95 active:scale-90 ease-in-out duration-100
      ${checkVariant(variant)} }`}
    >
      {name}
    </button>
  );
};

export const ButtonWithLeadingIcon = ({ variant, name, disabled, type, icon, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none
      ${checkVariant(variant)}  `}
    >
      {icon && <div className="-mt-0.5 ml-2">{icon}</div>}
      <div className="heading-6">{name}</div>
    </button>
  );
};

export const ButtonWithTrailingIcon = ({ variant, name, disabled, type, icon, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none
      ${checkVariant(variant)}  `}
    >
      <div className="heading-6">{name}</div>
      {icon && <div className="-mt-0.5 ml-2">{icon}</div>}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  additionalClasses: "",
  variant: "primarySolid",
};
