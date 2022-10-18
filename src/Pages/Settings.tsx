import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Components/Atoms/Buttons";
import { Input, MultiSelect, TextArea } from "../Components/Atoms/FormElements";
import ImageUploader from "../Components/Atoms/UploadFiles";

const Settings = () => {
  // managing dropdown items (list of dropdown items)
  const items: Array<string> = ["John", "Milos", "Steph", "Kathreine"];

  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const onSubmit = (data: { [dataItems: string]: string[] }) => {
    selectedItems.length === 0 && setError(true);
    !error && (data["image"] = files[0]?.preview) && (data["selected_options"] = selectedItems) && console.log(data);
  };

  return (
    <div className="main-container mb-10 mt-24">
      <p className="heading-4 mb-6 md:mb-2">Settings</p>
      <div className="flex justify-between">
        <p className="heading-6 border-b-4 pb-2 border-primary flex items-end">Edit Profile</p>
        <div className="mb-4  hidden md:block">
          <Button variant="outline" name="Sign up for Artist" type={"button"} />
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-6 pt-10 border-t border-primary">
        <div className="col-span-2">
          <div className="flex justify-center md:block">
            <ImageUploader
              parentDivClassName="rounded-full w-60 h-60"
              imageClassName="rounded-full object-cover"
              maximumFiles={1}
              images={image}
              setImages={setImage}
            />
          </div>
          <div className="flex justify-center flex-col md:w-60">
            <p className="heading-5 text-center py-5">0x6fDFab3...8Fa7</p>
            <div className="mx-auto md:text-center">
              <Button variant="outline" name="Edit Profile" type={"button"} />
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
              rows={4}
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
            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                placeholder={"Select..."}
                name={"options"}
                label={"Options"}
                options={items}
                error={error}
                setError={setError}
              />
            </div>
            <div className="mt-10">
              <Button variant="primary" name="Submit Profile" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
