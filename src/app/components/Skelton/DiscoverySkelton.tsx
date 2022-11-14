import React from 'react';

function DiscoverySkelton() {
  return (
    <div className="main-container w-full min-h-[76vh] mt-28 mb-12">
      <p className="border-b my-10 pb-1 heading-4">Trending Arts</p>
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-20">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
          <div className="col-span-4" key={index}>
            <div className="w-[91vw] sm:w-full bg-gray-400  rounded-xl relative">
              <div className="cursor-pointer  animate-pulse rounded-t-xl w-full h-96 bg-gray-400"></div>
              <div className="p-6 pt-4 animate-pulse bg-black">
                <div className=" h-4 w-52   rounded bg-gray-40"></div>

                <div className="w-44 mt-6 rounded h-4 t bg-gray-40"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscoverySkelton;
