import { useForm } from "react-hook-form";
import { Button } from "../Components/Atoms/Buttons";
import { Input, TextArea } from "../Components/Atoms/FormElements";

const Homepage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: object) => {
    console.log(JSON.stringify(data));
  };

  const tailwindCssClassForComponents = {
    inputClass: "p-2 md:w-72 bg-gray-30 paragraph-3 rounded-sm border-gray-20  border focus:outline-none",
  };

  return (
    <div className="main-container my-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          type="text"
          label="First Name"
          placeholder="Enter your name"
          register={register}
          required
          className={tailwindCssClassForComponents.inputClass}
        />
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email "
          register={register}
          required
          className={tailwindCssClassForComponents.inputClass}
        />
        <TextArea
          type="text"
          label="Bio"
          placeholder="Explain about yourself"
          register={register}
          required
          className="p-2 bg-gray-30 paragraph-3  rounded-sm border-gray-20  border focus:outline-none"
        />
        <Button variant="primary" name="Submit" type="submit" />
      </form>
    </div>
  );
};

export default Homepage;
