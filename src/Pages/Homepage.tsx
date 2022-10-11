import { useForm } from "react-hook-form";
import Input from "../Components/Atoms/InputField";

const Homepage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: object) => {
    console.log(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-60">
      <Input
        type="text"
        label="First Name"
        register={register}
        required
        className="w-48 p-2 paragraph-1  border-primary focus: outline-none  border "
      />
    </form>
  );
};

export default Homepage;
