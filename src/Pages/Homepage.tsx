import { useForm } from "react-hook-form";
import { Button } from "../Components/Atoms/Buttons";
import { Input, TextArea } from "../Components/Atoms/FormElements";

const Homepage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: object) => {
    console.log(JSON.stringify(data));
  };

  return (
    <div className="main-container my-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input type="text" name="fname" label="First Name" placeholder="Enter your name" register={register} required />
        <Input type="email" name="email" label="Email" placeholder="Enter your email " register={register} required />
        <TextArea type="text" name="explain_about_yourself" label="Bio" placeholder="Explain about yourself" register={register} required />
        <Button variant="primary" name="Submit" type="submit" />
      </form>
    </div>
  );
};

export default Homepage;
