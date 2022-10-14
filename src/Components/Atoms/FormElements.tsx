type InputProps = {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  register: any; //register is a useForm hook function of react-hook-form
  required?: boolean;
  pattern?: string;
};

const tailwindCssClass = {
  inputClass: "p-2 bg-gray-30 paragraph-3 rounded-sm border-gray-20  border focus:outline-none",
};

export const Input = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="paragraph-2">
        {label}
      </label>
      <input
        {...register(name, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={tailwindCssClass.inputClass}
      />
    </div>
  );
};

export const TextArea = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="paragraph-2">
        {label}
      </label>
      <textarea
        {...register(name, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={tailwindCssClass.inputClass}
        rows="4"
      />
    </div>
  );
};
