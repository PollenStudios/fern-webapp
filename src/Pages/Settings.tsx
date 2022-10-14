import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Components/Atoms/Buttons";
import { Input, TextArea } from "../Components/Atoms/FormElements";
import ImageUploader from "../Components/Atoms/UploadFiles";

const Settings = () => {
  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState<any[]>([]);

  const onSubmit = (data: { [x: string]: string }) => {
    data["image"] = files[0].preview;
    console.log(data);
  };

  return (
    <div className="main-container mb-10 mt-24">
      <p className="heading-4 mb-6 md:mb-2">Settings</p>
      <div className="flex justify-between">
        <p className="heading-6 border-b-4 pb-2 border-primary flex items-end">Edit Profile</p>
        <div className="mb-4  hidden md:block">
          <Button variant="outline" name="Sign up for Artist" type={undefined} onClick={undefined} />
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-6 pt-10 border-t border-primary">
        <div className="col-span-2">
          <div className="flex justify-center md:block">
            <ImageUploader
              className="rounded-full w-60 h-60"
              additionalClasses="rounded-full object-cover"
              maximumFiles={1}
              files={files}
              setFiles={setFiles}
            />
          </div>
          <div className="flex justify-center flex-col md:w-60">
            <p className="heading-5 text-center py-5">0x6fDFab3...8Fa7</p>
            <div className="mx-auto md:text-center">
              <Button variant="outline" name="Edit Profile" type={undefined} onClick={undefined} />
            </div>
          </div>
        </div>
        <div className="col-span-4 pt-10 md:pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <p className="heading-5 pb-2 border-b border-primary">Personal details</p>
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
            <TextArea
              type="text"
              name="explain_about_yourself"
              label="Bio"
              placeholder="Explain about yourself"
              register={register}
              required
            />
            <p className="heading-5 pb-2 pt-8 border-b border-primary">Social Media</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Input type="text" name="facebook" label="Facebook" placeholder="Enter your Facebook id" register={register} required />
              <Input type="text" name="instagram" label="Instagram" placeholder="Enter your Instagram id" register={register} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input type="text" name="twitter" label="Twitter" placeholder="Enter your Twitter id" register={register} required />
              <Input type="text" name="other" label="Other" placeholder="Enter your other handle id" register={register} required />
            </div>
            <div className="mt-10">
              <Button variant="primary" name="Submit Profile" type="submit" onClick={undefined} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
