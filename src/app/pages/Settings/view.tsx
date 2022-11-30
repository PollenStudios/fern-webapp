import { Button } from 'app/components/atoms/Buttons';
import { Input, TextArea } from 'app/components/atoms/FormElements';
import { Loader } from 'app/components/atoms/Loader';
import EnableDispatcher from 'app/components/Dispatcher/EnableDispatcher';
import OverlayLoader from 'app/components/OverlayLoader';
import ProfileImage from 'app/components/ProfileImage';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { EMAIL_REGEX, NAME_REGEX, URL_REGEX } from 'utils/constant';

function SettingsView({
  isLoading,
  currentProfile,
  SignUpForArtist,
  checkRequestStatus,
  handleSubmit,
  updateUserProfileData,
  register,
  errors,
  isDirty,
}: any) {
  const errorMessageClassName = 'paragraph-3 mt-1 text-red-600';
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Settings - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="main-container mb-10 mt-24">
        {isLoading && <OverlayLoader />}
        <p className="heading-4 mb-6 md:mb-2">Settings</p>
        <div className="flex justify-between">
          <p className="heading-5 border-b-4 pb-2 border-primary flex items-end">Edit Profile</p>

          <div className="mb-2 sm:mb-4 flex justify-end items-end">
            {currentProfile?.artistApprovalStatus === null ? (
              <Button onClick={SignUpForArtist} variant="outline" name="Sign up for Artist" type="button" />
            ) : (
              currentProfile?.artistApprovalStatus === 'pending' && (
                <Button onClick={checkRequestStatus} variant="outline" name="Check Request Status" type="button" />
              )
            )}
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-6 pt-10 border-t border-primary">
          <div className="col-span-2">
            {/* profile Image Component */}
            <ProfileImage />

            <div className="flex justify-center flex-col">
              <p className="heading-5 text-center py-5">
                {currentProfile?.ownedBy
                  ? currentProfile?.ownedBy?.slice(0, 9) + '...' + currentProfile?.ownedBy?.slice(-4)
                  : ''}
              </p>
            </div>
          </div>
          <div className="col-span-4 pt-10 md:pt-0">
            <form onSubmit={handleSubmit(updateUserProfileData)} className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-primary">
                <p className="heading-5 ">Personal details</p>
                {currentProfile?.artistApprovalStatus === 'approved' && (
                  <Button
                    disabled
                    additionalClasses="heading-6 pb-3 text-white text-center"
                    name="Artist"
                    type="button"
                    variant="outline"
                  />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    label="Name"
                    placeholder="Enter your name"
                    register={register}
                    required
                    pattern={NAME_REGEX}
                  />
                  {errors.firstName && errors.firstName.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your name correctly</p>
                  )}
                  {errors.firstName && errors.firstName.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your name</p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    name="userName"
                    label="User name"
                    placeholder="Enter your user name"
                    register={register}
                    disabled
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter your email "
                    register={register}
                    required
                    pattern={EMAIL_REGEX}
                  />
                  {errors.email && errors.email.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your correct email id</p>
                  )}
                  {errors.email && errors.email.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your email id</p>
                  )}
                </div>
                {/* <p
                className='paragraph-2 md:paragraph-1 cursor-pointer w-28 text-tertiary flex items-center md:mt-6'
                onClick={() => console.log('Verify Email')}
                >
                    Verify email
                </p> */}
              </div>
              <TextArea
                type="text"
                name="bio"
                label="Bio"
                placeholder="Explain about yourself"
                register={register}
                rows={4}
              />
              <p className="heading-5 pb-2 pt-8 border-b border-primary">Social Media</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="website"
                    label="Website"
                    placeholder="www.f3rn.com"
                    register={register}
                    pattern={URL_REGEX}
                    prefix="https"
                  />
                  {errors.website && errors.website.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your valid website URL</p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    name="instagram"
                    label="Instagram"
                    prefix="https"
                    placeholder="www.instagram.com/f3rn/"
                    pattern={URL_REGEX}
                    register={register}
                    required
                  />
                  {errors.instagram && errors.instagram.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your valid Instagram profile URL</p>
                  )}
                  {errors.instagram && errors.instagram.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your Instagram profile URL</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="twitter"
                  label="Twitter"
                  prefix="https"
                  placeholder="www.twitter.com/f3rnapp/"
                  register={register}
                  pattern={URL_REGEX}
                />
              </div>
              {errors.instagram && errors.instagram.type === 'pattern' && (
                <p className={errorMessageClassName}>Enter your valid Twitter profile URL</p>
              )}

              {/* Enable Dispatcher Component */}
              <p className="heading-5 pb-2 pt-8 border-b border-primary">Dispatcher</p>
              <div className="flex">
                <EnableDispatcher />
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <div className="bg-primary w-[85px] py-2 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
                    <Loader />
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    disabled={!isDirty}
                    additionalClasses={!isDirty ? 'cursor-not-allowed' : ''}
                    name="Save"
                    type="submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsView;
