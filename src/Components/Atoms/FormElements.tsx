type InputProps = {
  label: string;
  type: string;
  placeholder: string;
  className: string;
  register: any;
  required: boolean;
  pattern?: string | undefined;
};

export const Input = ({ label, type, placeholder, className, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input {...register(label, { required, pattern: { pattern } })} type={type} placeholder={placeholder} className={className} />
    </div>
  );
};

export const TextArea = ({ label, type, placeholder, className, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <textarea
        {...register(label, { required, pattern: { pattern } })}
        type={type}
        placeholder={placeholder}
        className={className}
        rows="3"
      />
    </div>
  );
};
