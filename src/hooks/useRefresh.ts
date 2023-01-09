import {useEffect} from 'react'
import {useLazyQuery} from '@apollo/client'
import {RefreshDocument} from 'graphql/generated/types'
import {useAppStore} from 'store/app'

// custom hook for getting recommended profiles

const useGetRecommendedProfiles = () => {
  const [refreshToken] = useLazyQuery(RefreshDocument)

  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn)

  useEffect(() => {
    setIsLoggedIn(true)
    ;(async () => {
      try {
        const data = await refreshToken({
          variables: {
            request: {
              refreshToken: localStorage.getItem('refreshToken'),
            },
          },
        })

        localStorage.setItem('accessToken', data.data?.refresh.accessToken)
        localStorage.setItem('refreshToken', data.data?.refresh.refreshToken)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('err', error)
        }
        setIsLoggedIn(false)
      }
    })()
  }, [])
}
export default useGetRecommendedProfiles
