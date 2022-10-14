import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Components/Atoms/Buttons";
import { Input, TextArea } from "../Components/Atoms/FormElements";
import ImageUploader from "../Components/Atoms/UploadFiles";
import { workInProgressAlert } from "../Util/Utility";

const HomePage = () => {
  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState<any[]>([]);

  const onSubmit = (data: { [x: string]: string }) => {
    data["image"] = files[0].preview;
    console.log(data);
  };

  return (
    <div className="main-container mb-10 mt-24">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="heading-6 pb-2 border-b border-primary">Personal details</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Input type="text" name="name" label="Name" placeholder="Enter your name" register={register} required />
          <Input type="text" name="username" label="User name" placeholder="Enter your user name" register={register} required />
        </div>
        <div className="grid md:grid-cols-2 gap-2 md:gap-4">
          <Input type="email" name="email" label="Email" placeholder="Enter your email " register={register} required />
          <p
            className="paragraph-2 md:paragraph-1 cursor-pointer w-28 text-tertiary flex items-center md:mt-8"
            onClick={() => console.log("Verify Email")}
          >
            Verify email
          </p>
        </div>
        <TextArea type="text" name="explain_about_yourself" label="Bio" placeholder="Explain about yourself" register={register} required />
        <p className="heading-6 pb-2 border-b border-primary">Social Media</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Input type="text" name="facebook" label="Facebook" placeholder="Enter your Facebook id" register={register} required />
          <Input type="text" name="instagram" label="Instagram" placeholder="Enter your Instagram id" register={register} required />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Input type="text" name="twitter" label="Twitter" placeholder="Enter your Twitter id" register={register} required />
          <Input type="text" name="other" label="Other" placeholder="Enter your other handle id" register={register} required />
        </div>
        <div className="mt-6">
          <Button variant="primary" name="Submit Profile" type="submit" onClick={workInProgressAlert} />
        </div>
      </form>
    </div>
  );
};

export default HomePage;
