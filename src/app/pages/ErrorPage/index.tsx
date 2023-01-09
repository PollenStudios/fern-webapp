import React from 'react'
import {Helmet, HelmetProvider} from 'react-helmet-async'
import {Link} from 'react-router-dom'
import {PageRoutes} from 'utils/config'

function ErrorPage() {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Error - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className='main-container h-[93vh] flex md:flex-col bg-white pt-20 pb-12'>
        <main className='mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8'>
          <div className='py-16'>
            <div className='text-center'>
              <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                Something Went Wrong.
              </h1>
              <p className='mt-2 text-base text-gray-500'>Please try after sometime.</p>
              <div className='mt-6'>
                <Link to={PageRoutes.DISCOVERY} className='text-base font-medium text-primary'>
                  Go back home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default ErrorPage
