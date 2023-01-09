import React from 'react'

function UserProfileSidebarSkelton() {
  return (
    <div className='col-span-1 relative text-center'>
      <div className='rounded-full w-48 h-48 absolute -top-24 border-4 border-white md:left-6'>
        <div className='rounded-full object-cover bg-gray-400  w-full h-full' />
      </div>
      <div className='flex justify-center flex-col pl-5 sm:pl-0 pt-28'>
        <div className='h-4 w-40 md:w-60 heading-6 sm:heading-5 bg-gray-400 rounded-lg mt-6 capitalize'></div>
        <div className='h-10 w-40 md:w-60 sm:ml-6 bg-gray-400 rounded-lg mt-6 md:ml-0'></div>

        <div>
          <div className='bg-gray-400 rounded-lg mt-6 h-4 w-8  pt-5'></div>
          <div className='bg-gray-400 rounded-lg mt-6 h-4 w-full sm:paragraph-2  text-left  pt-2 pb-5 break-words'></div>
        </div>

        <div className='bg-gray-400 rounded-lg mt-6 h-4 w-10 pt-2'></div>
        <div className='flex space-x-6 pt-2'>
          <div className='h-6 w-6 bg-gray-400 rounded-lg mt-6'></div>
          <div className='h-6 w-6 bg-gray-400 rounded-lg mt-6'></div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileSidebarSkelton
