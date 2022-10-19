type ButtonProps = {
  variant: "primary" | "outline" | "danger" | "success" | "warning";
  name: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  icon?: string;
  onClick: any;
  additionalClasses?: string;
};

const checkVariant = (variant: string) => {
  switch (variant) {
    case "primary":
      return "bg-primary border-none";
    case "outline":
      return "border-gray-40 text-gray-40";
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

export const Button = ({ variant, name, disabled, type, onClick, additionalClasses }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`heading-6 w-full sm:w-auto py-1.5 sm:px-6 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none 
      ${checkVariant(variant)} ${additionalClasses}`}
    >
      {name}
    </button>
  );
};

export const ButtonWithLeadingIcon = ({ variant, name, disabled, type, icon, onClick, additionalClasses }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none
      ${checkVariant(variant)} ${additionalClasses}`}
    >
      {icon && <div className="-mt-0.5 ml-2">{icon}</div>}
      <div className="heading-6">{name}</div>
    </button>
  );
};

export const ButtonWithTrailingIcon = ({ variant, name, disabled, type, icon, onClick, additionalClasses }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none
      ${checkVariant(variant)} ${additionalClasses}`}
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
  type: "button",
};
