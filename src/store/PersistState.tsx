import {ethers} from 'ethers'
import {useEffect, useRef} from 'react'
import clearStorage from 'utils/clearStorage'
import parseJwt from 'utils/parseJwt'

import {useLazyQuery} from '@apollo/client'
import {UserProfilesDocument} from 'graphql/generated/types'
import {useNavigate} from 'react-router-dom'
import {getBackendProfile} from 'utils/generateNonce'
import {PageRoutes} from 'utils/config'
import toast from 'react-hot-toast'
import {useAccount} from 'wagmi'
import {useAppStore} from './app'
import {emptyProfile} from 'utils/Profile'
// import { useLocation } from 'react-router-dom';

const PersistState = ({children}: any) => {
  // const { pathname } = useLocation();
  const walletProvider = useRef(window.ethereum)

  const {address} = useAccount()
  const navigate = useNavigate()
  // const [verify] = useLazyQuery(VerifyDocument)

  const [getProfiles] = useLazyQuery(UserProfilesDocument)

  const token = localStorage.getItem('backendToken')

  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const setHasProfile = useAppStore((state) => state.setHasProfile)
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setWalletAddress = useAppStore((state) => state.setWalletAddress)
  const setWalletBalance = useAppStore((state) => state.setWalletBalance)
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn)
  const setIsHandleSignLoading = useAppStore((state) => state.setIsHandleSignLoading)

  const logout = () => {
    clearStorage()
    setIsLoggedIn(false)
  }

  const verifyToken = async (token: string) => {
    try {
      // const {data} = await verify({
      //   variables: {
      //     request: {
      //       accessToken: token,
      //     },
      //   },
      // })
      // setIsLoggedIn(data?.verify)
    } catch (error) {
      console.log(error)
    }
  }
  const verifyProfileForLogin = async (address: string | undefined) => {
    try {
      //get all profiles
      const {data: profilesData} = await getProfiles({
        variables: {ownedBy: address},
      })

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false)
        setCurrentProfile(emptyProfile)
        setUserSigNonce(0)
        navigate(PageRoutes.SIGN_UP)
      } else if (token && token !== 'undefined') {
        const profiles: any = profilesData?.profiles?.items
        const getProfileResult = await getBackendProfile()

        setHasProfile(true)
        setIsLoggedIn(true)
        setUserSigNonce(profilesData?.userSigNonces?.lensHubOnChainSigNonce)

        setCurrentProfile({
          ...profiles[0],
          artistApprovalStatus: getProfileResult?.artist_approval_status,
        })
      } else {
        toast.error('No profile found')
        setHasProfile(true)
        setIsLoggedIn(false)
        setUserSigNonce(0)

        setCurrentProfile(emptyProfile)
      }
    } catch (error) {
      setHasProfile(false)
      setIsLoggedIn(false)
      setUserSigNonce(0)
      setCurrentProfile(emptyProfile)
      toast.error('Something went wrong')
      navigate(PageRoutes.ERROR_PAGE)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken || accessToken === 'undefined') {
        logout()
        return
      }

      const isExpired = Date.now() >= parseJwt(accessToken)?.exp * 1000
      if (isExpired) {
        logout()
        return
      }

      verifyToken(accessToken)

      const fetchUserData = async () => {
        try {
          const accountAddress = address?.toLowerCase()

          if (accountAddress) {
            // @ts-ignore
            setWalletAddress(accountAddress)
            verifyProfileForLogin(accountAddress)

            const provider = new ethers.providers.Web3Provider(walletProvider.current)
            //@ts-ignore
            const balance = await provider.getBalance(accountAddress)
            const balanceInEth = ethers.utils.formatEther(balance)
            setWalletBalance(balanceInEth)
          } else {
            toast.error('Please connect to wallet')
          }
        } catch (error: any) {
          setWalletAddress('')
          setIsHandleSignLoading(false)
          console.log({error})
          toast.error('Something went wrong')
        }
      }

      fetchUserData()
    }
  }, [])

  return <div>{children}</div>
}

export default PersistState
