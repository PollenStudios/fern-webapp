type InputProps = {
  label: string;
  register: any;
  required: boolean;
  className: string;
};

const Input = ({ label, register, required, className }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input {...register(label, { required })} className={className} />
    </div>
  );
};

export default Input;
