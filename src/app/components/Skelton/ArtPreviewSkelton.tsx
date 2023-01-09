import React from 'react'

function ArtPreviewSkelton() {
  return (
    <div className='main-container md:h-[82.5vh] mt-24 mb-24 md:mb-auto md:mt-24'>
      <div className='grid grid-cols-6 '>
        <div className='col-span-6 md:col-span-3 border border-r-0'>
          {<div className='w-full h-[600px] bg-gray-400 animate-pulse'></div>}
        </div>
        <div className='col-span-6 md:col-span-3 sm:border border-l-0'>
          <div className='flex flex-col justify-center'>
            <div className='flex justify-between items-center bg-gray-30 px-6'>
              <div className='flex items-center h-20 gap-2'>
                <div className='w-8 h-8 rounded-full border border-secondary animate-pulse bg-gray-400'></div>
                <div className='w-60 h-4 bg-gray-400 rounded animate-pulse'></div>
              </div>
            </div>
          </div>
          <div className='px-6 mt-10'>
            <div className='w-60 h-4 border-b  bg-gray-400 animate-pulse rounded'></div>
            <div className='w-60 h-6 border-b mt-4 bg-gray-400 animate-pulse rounded'></div>
            <div className=' w-60 h-2 lg:w-full pt-10 mt-7  rounded animate-pulse  bg-gray-400'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtPreviewSkelton
