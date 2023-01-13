import {useLazyQuery} from '@apollo/client'
import {createContext, useCallback, useEffect, useRef} from 'react'
import {ethers} from 'ethers'
import {useNavigate} from 'react-router-dom'

import {UserProfilesDocument} from 'graphql/generated/types'

import {getBackendProfile} from 'utils/generateNonce'
import clearStorage from 'utils/clearStorage'
import {PageRoutes} from 'utils/config'
import {useAppStore} from './app'
import {emptyProfile} from 'utils/Profile'
import {useAccount} from 'wagmi'
import parseJwt from 'utils/parseJwt'
export const WalletContext = createContext({})

const Main = ({children}: any) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('backendToken')

  const {address} = useAccount()
  const walletProvider = useRef(window.ethereum)

  const [getProfiles] = useLazyQuery(UserProfilesDocument)
  // const [verify] = useLazyQuery(VerifyDocument)

  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const setHasProfile = useAppStore((state) => state.setHasProfile)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn)
  const setWalletBalance = useAppStore((state) => state.setWalletBalance)
  const setIsHandleSignLoading = useAppStore((state) => state.setIsHandleSignLoading)
  const setWalletAddress = useAppStore((state) => state.setWalletAddress)

  // get wallet balance
  const fetchWalletBalance = async (address: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider?.current)
      const balance = await provider.getBalance(address)
      const balanceInEth = ethers.utils.formatEther(balance)
      setWalletBalance(balanceInEth)
    } catch (error) {
      console.log('error occurred', error)
      setWalletBalance('error in getting balance')
    }
  }

  // const verifyToken = async (token: string) => {
  //   try {
  //     const {data} = await verify({
  //       variables: {
  //         request: {
  //           accessToken: token,
  //         },
  //       },
  //     })
  //     // @ts-ignore
  //     setIsLoggedIn(data?.verify)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
        // toast.error('No profile found');
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
      // toast.error('Something went wrong');
      // navigate(PageRoutes.ERROR_PAGE);
    }
  }

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken || accessToken === 'undefined') {
      clearStorage()
      return
    }

    const isExpired = Date.now() >= parseJwt(accessToken)?.exp * 1000
    if (isExpired) {
      clearStorage()
      return
    }

    // verifyToken(accessToken);
    try {
      const accountAddress = address?.toLowerCase()
      if (accountAddress) {
        setWalletAddress(accountAddress)
        verifyProfileForLogin(accountAddress)
        fetchWalletBalance(accountAddress)
      } else {
        console.log('Please connect to wallet')
      }
    } catch (error: any) {
      setWalletAddress('')
      setIsHandleSignLoading(false)
      console.log({error})
      // toast.error('Something went wrong');
    }
  }

  const logout = useCallback(() => {
    clearStorage()
    setCurrentProfile(emptyProfile)
    setIsLoggedIn(false)
    navigate(PageRoutes.DISCOVERY)
  }, [navigate])

  useEffect(() => {
    walletProvider?.current?.on('accountsChanged', () => {
      logout()
    })
  }, [logout, walletProvider?.current?.selectedAddress])

  useEffect(() => {
    walletProvider?.current?.on('chainChanged', () => {
      logout()
    })
  }, [logout, walletProvider?.current?.chainId])

  useEffect(() => {
    fetchUserData()
  }, [])

  return <div>{children}</div>
}

export default Main
