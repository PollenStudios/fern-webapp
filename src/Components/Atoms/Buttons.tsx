type ButtonProps = {
  variant: string;
  name: string;
  type: "button" | "submit" | "reset" | undefined;
  icon?: string;
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

export const Button = ({ variant, name, type }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`heading-6 inline-flex items-center px-6 py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none 
      ${checkVariant(variant)} }`}
    >
      {name}
    </button>
  );
};

export const ButtonWithIcon = ({ variant, name, type, icon }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none
      ${checkVariant(variant)}  `}
    >
      <img className="w-6 h-6 rounded-full" src={icon} alt={name} />
      <div className="heading-6">{name}</div>
    </button>
  );
};
