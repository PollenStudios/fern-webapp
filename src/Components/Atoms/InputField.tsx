type InputProps = {
  label: string;
  type: string;
  className: string;
  register: any;
  required: boolean;
};

const Input = ({ label, type, className, register, required }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input {...register(label, { required })} type={type} className={className} />
    </div>
  );
};

export default Input;
