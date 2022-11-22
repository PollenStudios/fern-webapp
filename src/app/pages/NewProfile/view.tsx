import { Button } from 'app/components/atoms/Buttons';
import { Input } from 'app/components/atoms/FormElements';
import { ImagePreviewer } from 'app/components/atoms/UploadFiles';
import OverlayLoader from 'app/components/OverlayLoader';

const errorMessageClassName = 'paragraph-3 mt-1 text-red-600';

export interface IProps {
  avatar: any;
  register: any;
  handleSubmit: any;
  onSubmit: any;
  isLoading: boolean;
  setAvatar: any;
  isHandleExist: boolean;
  errors: any;
  setIsHandleExist: any;
}

function View({
  avatar,
  register,
  handleSubmit,
  onSubmit,
  isLoading,
  setAvatar,
  isHandleExist,
  errors,
  setIsHandleExist,
}: IProps) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="flex flex-col gap-4 my-28 h-[69.5vh]  justify-center w-full md:w-[50vw] xl:w-[40vw] main-container"
    >
      {isLoading && <OverlayLoader />}
      <p className="heading-5 pb-2 border-b border-primary">Create new profile</p>
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col gap-4">
          <label htmlFor={'image'} className="heading-6  mt-5">
            Profile image *
          </label>
          <div className="flex flex-col gap-4">
            <ImagePreviewer profileImage imagePreview={avatar && URL.createObjectURL(avatar)} />

            <input
              name="image"
              className=""
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={e => {
                e.target.files && setAvatar(e.target.files[0]);
              }}
            />
          </div>
        </div>
        <div>
          <Input
            type="text"
            name="handle"
            label="User handle"
            placeholder="Enter your handle"
            register={register}
            onChange={() => {
              setIsHandleExist(false);
            }}
            required
            pattern={/^[a-z0-9_]{5,30}$/}
          />
          {errors.handle && errors.handle.type === 'pattern' && (
            <p className={errorMessageClassName}>Check handle format</p>
          )}
          {isHandleExist && <p className={errorMessageClassName}>Handle already taken try something else</p>}
        </div>
        <ul>
          <li>1. Handle limit is 30 characters.</li>
          <li>2. You can add lowercase alphabets, _ and numbers.</li>
        </ul>
      </div>
      <div className="mt-10">
        <Button
          variant="primary"
          disabled={isLoading}
          additionalClasses={isLoading ? 'cursor-not-allowed' : ''}
          name={isLoading ? 'Creating...' : 'Create'}
          type="submit"
        />
      </div>
    </form>
  );
}

export default View;
