import React from 'react'

function UserProfileTabSkelton() {
  return (
    <div className='w-full min-h-[76vh] '>
      <div className='grid sm:grid-cols-8 lg:grid-cols-12 gap-6 my-2'>
        {[0, 1, 2, 3].map((index) => (
          <div className='col-span-5 sm:col-span-4 md:col-span-6' key={index}>
            <div className='w-[91vw] sm:w-full bg-gray-400  rounded-xl relative'>
              <div className='cursor-pointer border  animate-pulse rounded-t-xl w-full h-96 bg-gray-300'></div>
              <div className='p-6 pt-4 rounded-b-xl bg-black'>
                <div className=' h-4 w-52   rounded  animate-pulse bg-gray-40'></div>

                <div className='w-44 mt-6 rounded h-4  animate-pulse bg-gray-40'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserProfileTabSkelton
