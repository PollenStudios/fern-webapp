type InputProps = {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  register: any; //register is a useForm hook function of react-hook-form
  required: boolean;
  pattern?: string;
};

export const Input = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(label, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="md:w-72 p-2 bg-gray-30 paragraph-3 rounded-sm border-gray-20  border focus:outline-none"
      />
    </div>
  );
};

export const TextArea = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <textarea
        {...register(label, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="p-2 bg-gray-30 paragraph-3  rounded-sm border-gray-20  border focus:outline-none"
        rows="3"
      />
    </div>
  );
};
