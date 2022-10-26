import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./Atoms/Buttons";
import { Input } from "./Atoms/FormElements";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: object) => {
    console.log(data);
  };

  const errorMessageClassName = "paragraph-3 mt-1 text-red-600";

  return (
    <div className="md:h-screen bg-gray-45 flex justify-center ">
      <div className="h-max bg-white mt-40 mb-20 border md:border-primary p-7 w-full md:w-1/3">
        <div className="border-b border-gray-40 pb-2 heading-4 flex gap-2 ">
          <ArrowLeftIcon className="w-8 cursor-pointer" onClick={() => navigate(-1)} />
          <div className="heading-4">Sign up for Artist</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
          <div>
            <Input
              label={"Name"}
              type={"text"}
              name={"name"}
              placeholder={"Juliette Hayt"}
              register={register}
              required
              pattern={/^[a-zA-Z ]*$/}
            />
            {errors.name && errors.name.type === "pattern" && <p className={errorMessageClassName}>Enter your user name</p>}
          </div>
          <div>
            <Input
              label={"Email Address"}
              type={"email"}
              name={"email"}
              placeholder={"juliettehayt@gmail.com"}
              register={register}
              required
              pattern={
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              }
            />
            {errors.email && errors.email.type === "pattern" && <p className={errorMessageClassName}>Enter your correct email</p>}
          </div>
          <Input label={"Website"} type={"url"} name={"website"} placeholder={"https://www.artist.com"} register={register} required />
          <Input
            label={"Social Media"}
            type={"url"}
            name={"social_media"}
            placeholder={"https://www.insta.com"}
            register={register}
            required
          />
          <div className="flex justify-end">
            <Button name={"Submit"} variant={"primary"} type={"submit"} additionalClasses={""} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
