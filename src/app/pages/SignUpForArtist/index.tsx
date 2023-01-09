import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {Button} from 'app/components/atoms/Buttons'
import {Input} from 'app/components/atoms/FormElements'
import {ArrowLeftIcon} from '@heroicons/react/24/outline'
import {toast} from 'react-hot-toast'
import config, {PageRoutes} from 'utils/config'
import {useEffect, useState} from 'react'
import {Loader} from 'app/components/atoms/Loader'
import {useAppStore} from 'store/app'
import {backendToken} from 'utils/getBackendToken'
import {apiRoutes} from 'API/apiRoutes'
import axios from 'axios'

function SignUpForArtist() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const account = useAppStore((state) => state.walletAddress)
  const currentProfile = useAppStore((state) => state.currentProfile)

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm()

  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length !== 0) {
      setValue('name', currentProfile?.name)
      setValue(
        'email',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'email')[0]
          ?.value,
      )
      // setValue(
      //   'website',
      //   currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]?.value,
      // );
      setValue(
        'instaHandle',
        'https://' +
          currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'instagram')[0]
            ?.value,
      )
    }
  }, [currentProfile, account])
  const onSubmit = async (formData: any) => {
    try {
      if (currentProfile?.artistApprovalStatus === 'approved') {
        toast.success('You are already a Artist')
        navigate('/settings')
        return 0
      }
      setIsLoading(true)
      const formBodyData = new FormData()
      formBodyData.append('email', formData.email)
      formBodyData.append('artist_approval_status', 'pending')
      formBodyData.append('first_name', formData.name.split(' ')[0])
      formBodyData.append('last_name', formData.name.split(' ')[1])
      // formBodyData.append('website', formData.website);
      formBodyData.append('insta_profile', formData.instaHandle)
      //Need the below api for sign up for artist and show is user artist or not
      const {data} = await axios({
        url: config.baseUrl + apiRoutes.userProfileMe,
        method: 'patch',
        headers: {
          Authorization: 'TOKEN ' + backendToken(),
        },
        data: formBodyData,
      })
      console.log('data', data)
      toast.success('Request pending for approval')
      navigate(PageRoutes.THANKYOU)
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  const errorMessageClassName = 'paragraph-3 mt-1 text-red-600'

  return (
    <div className='min-h-[92.5vh]  flex justify-center '>
      <div className='h-max bg-white mt-24 md:mt-40 mb-20 border  p-7 w-full md:w-1/4'>
        <div className='border-b  pb-2 heading-4 flex gap-2 '>
          <ArrowLeftIcon className='w-6 cursor-pointer' onClick={() => navigate(-1)} />
          <div className='heading-5'>Sign up for Artist</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 pt-4'>
          <div>
            <Input
              label='Name'
              type='text'
              name='name'
              placeholder='Juliette Hayt'
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
              label='Email Address'
              type='email'
              name='email'
              placeholder='juliettehayt@gmail.com'
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
            label='Instagram'
            type='url'
            name='instaHandle'
            disabled
            placeholder='https://www.insta.com'
            register={register}
            required
          />
          <div className='flex justify-end'>
            {isLoading ? (
              <div className='bg-primary w-[98px] py-2 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none'>
                <Loader />
              </div>
            ) : (
              <Button variant='primary' name='Submit' type='submit' />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpForArtist
