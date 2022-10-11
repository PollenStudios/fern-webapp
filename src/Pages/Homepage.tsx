import { useForm } from "react-hook-form";
import { Input, Select, TextArea } from "../Components/Atoms/FormElements";

const Homepage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: object) => {
    console.log(JSON.stringify(data));
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
          pattern=""
          className="p-2 w-72 bg-gray-30 paragraph-1 rounded-sm border-primary  border focus:outline-none"
        />
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email "
          register={register}
          required
          pattern=""
          className="p-2 w-72 bg-gray-30 paragraph-1   rounded-sm border-primary  border focus:outline-none"
        />
        <TextArea
          type="text"
          label="Bio"
          placeholder="Explain about yourself"
          register={register}
          required
          pattern={""}
          className="p-2 bg-gray-30 paragraph-1 rounded-sm border-primary  border focus:outline-none"
        />
        {/* <Select
          label="select"
          className="p-2 bg-gray-30 paragraph-1 rounded-sm border-primary  border focus:outline-none"
          register={register}
          required
        /> */}
      </form>
    </div>
  );
};

export default Homepage;
