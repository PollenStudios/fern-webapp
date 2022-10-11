type InputProps = {
  label: string;
  type: string;
  placeholder: string;
  className: string;
  register: any;
  required: boolean;
  pattern: string;
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

export const Select = (label: any, className: string, register: any, required: boolean) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select {...register(label, { required })} className={className}>
        <option value="">Select...</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
      </select>
    </div>
  );
};
