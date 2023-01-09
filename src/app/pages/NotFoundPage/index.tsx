import {Helmet, HelmetProvider} from 'react-helmet-async'
import {Link} from 'react-router-dom'
import {PageRoutes} from 'utils/config'

export default function NotFoundPage() {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>404 Not Found - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className='main-container h-screen flex md:flex-col bg-white pt-20 pb-12'>
        <main className='mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8'>
          <div className='py-16'>
            <div className='text-center'>
              <p className='text-base font-semibold text-primary'>404</p>
              <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                Page not found.
              </h1>
              <p className='mt-2 text-base text-gray-500'>
                Sorry, we couldn’t find the page you’re looking for.
              </p>
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
