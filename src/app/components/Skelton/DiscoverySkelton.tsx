import React from 'react'

function DiscoverySkelton() {
  return (
    <div className='w-full min-h-[76vh] mt-16 mb-12'>
      <div className='grid sm:grid-cols-8 lg:grid-cols-12 gap-6'>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
          <div className='col-span-4' key={index}>
            <div className='w-[91vw] sm:w-full bg-gray-400  rounded-xl relative'>
              <div className='cursor-pointer border  animate-pulse rounded-t-xl w-full h-96 bg-white'></div>
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

export default DiscoverySkelton
