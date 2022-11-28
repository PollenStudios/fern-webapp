import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from 'app/components/atoms/Buttons';
import { Input } from 'app/components/atoms/FormElements';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config, { PageRoutes } from 'utils/config';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import { apiRoutes } from 'API/apiRoutes';
import { backendToken } from 'utils/getBackendToken';

function SignUpForArtist() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    accountState: { account },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length !== 0) {
      setValue('name', currentProfile.name);
      setValue('email', currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'email')[0]?.value);
      // setValue(
      //   'website',
      //   currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]?.value,
      // );
      setValue(
        'instaHandle',
        'https://' + currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'instagram')[0]?.value,
      );
    }
  }, [currentProfile, account]);
  const onSubmit = async (formData: any) => {
    try {
      if (currentProfile?.artistApprovalStatus === 'approved') {
        toast.success('You are already a Artist');
        navigate('/settings');
        return 0;
      }
      setIsLoading(true);
      const formBodyData = new FormData();
      formBodyData.append('email', formData.email);
      formBodyData.append('artist_approval_status', 'pending');
      formBodyData.append('first_name', formData.name.split(' ')[0]);
      formBodyData.append('last_name', formData.name.split(' ')[1]);
      // formBodyData.append('website', formData.website);
      formBodyData.append('insta_profile', formData.instaHandle);
      const { data } = await axios({
        url: config.baseUrl + apiRoutes.userProfileMe,
        method: 'patch',
        headers: {
          Authorization: 'TOKEN ' + backendToken(),
        },
        data: formBodyData,
      });
      toast.success('Request pending for approval');
      navigate(PageRoutes.THANKYOU);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const errorMessageClassName = 'paragraph-3 mt-1 text-red-600';

  return (
    <div className="min-h-[92.5vh] bg-gray-45 flex justify-center ">
      <div className="h-max bg-white mt-24 md:mt-40 mb-20 border md:border-primary p-7 w-full md:w-1/3">
        <div className="border-b border-gray-40 pb-2 heading-4 flex gap-2 ">
          <ArrowLeftIcon className="w-8 cursor-pointer" onClick={() => navigate(-1)} />
          <div className="heading-4">Sign up for Artist</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
          <div>
            <Input
              label="Name"
              type="text"
              name="name"
              placeholder="Juliette Hayt"
              disabled
              register={register}
              required
            />
            {errors.name && errors.name.type === 'pattern' && (
              <p className={errorMessageClassName}>Enter your user name</p>
            )}
          </div>
          <div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="juliettehayt@gmail.com"
              register={register}
              required
              disabled
            />
            {errors.email && errors.email.type === 'pattern' && (
              <p className={errorMessageClassName}>Enter your correct email</p>
            )}
          </div>
          {/* <Input
            label="Website"
            type="url"
            name="website"
            disabled
            placeholder="https://www.artist.com"
            register={register}
            required
          /> */}
          <Input
            label="Instagram"
            type="url"
            name="instaHandle"
            disabled
            placeholder="https://www.insta.com"
            register={register}
            required
          />
          <div className="flex justify-end">
            <Button
              variant="primary"
              disabled={isLoading}
              additionalClasses={isLoading ? 'cursor-not-allowed' : ''}
              name={isLoading ? 'Submiting...' : 'Submit'}
              type="submit"
            />{' '}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForArtist;
