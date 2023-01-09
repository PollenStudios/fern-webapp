import React from 'react'
import {useEffect, useRef} from 'react'
import config, {PageRoutes} from 'utils/config'
import {useAccount, useConnect, useNetwork} from 'wagmi'
import SwitchNetwork from '../SwitchNetwork'
import Modal from '../Modal'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {toast} from 'react-hot-toast'
import {useAppStore} from 'store/app'
import {ethers} from 'ethers'
import generateNonce, {createUser, getBackendProfile} from 'utils/generateNonce'
import {useLazyQuery, useMutation} from '@apollo/client'
import {
  AuthenticateDocument,
  ChallengeDocument,
  UserProfilesDocument,
} from 'graphql/generated/types'
import {useNavigate} from 'react-router-dom'
import {setAuthTokenInLocalStorage, signMessage} from 'graphql/utils/signMessage'
import {emptyProfile} from 'utils/Profile'
import {Loader} from '../atoms/Loader'

interface Props {
  openModal: boolean
  setIsLoading: (openModal: boolean) => void
}

const WalletConnector = ({openModal, setIsLoading}: Props) => {
  const {connector: activeConnector, isConnected, address} = useAccount()
  const {connect, connectors, isLoading} = useConnect({
    onError(error) {
      toast.error(error.message)
    },
  })
  const {chain} = useNetwork()

  const walletAddress = useAppStore((state) => state.walletAddress)
  const isHandleSignLoading = useAppStore((state) => state.isHandleSignLoading)
  const setWalletAddress = useAppStore((state) => state.setWalletAddress)
  const setIsHandleSignLoading = useAppStore((state) => state.setIsHandleSignLoading)

  const navigate = useNavigate()

  const [loadChallenge] = useLazyQuery(ChallengeDocument, {
    fetchPolicy: 'no-cache',
  })

  const [authenticate] = useMutation(AuthenticateDocument)
  const [getProfiles] = useLazyQuery(UserProfilesDocument)

  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const setHasProfile = useAppStore((state) => state.setHasProfile)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn)
  const setWalletBalance = useAppStore((state) => state.setWalletBalance)

  const walletProvider = useRef(window.ethereum)

  const verifyBackendGeneratedToken = async (token: string, profilesData: any, closeModal: any) => {
    if (token) {
      const getProfileResult = await getBackendProfile()
      setCurrentProfile({
        ...profilesData?.profiles?.items[0],
        artistApprovalStatus: getProfileResult?.artist_approval_status,
      })
      setHasProfile(true)
      setUserSigNonce(profilesData?.userSigNonces?.lensHubOnChainSigNonce)
      setIsLoggedIn(true)
      closeModal()
    }
  }

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

  //signMessage
  const handleSign = async (address: string, closeModal: any) => {
    setIsHandleSignLoading(true)

    //fetch wallet balance
    fetchWalletBalance(address)

    try {
      // Fetch challenge from lens
      const challenge = await loadChallenge({
        variables: {request: {address}},
      })

      // If user is not able to get the challenge from Lens api
      if (!challenge?.data?.challenge?.text) {
        throw new Error('Lens login is not completed')
      }

      // Sign User wallet message
      const signature = await signMessage(challenge?.data?.challenge?.text)

      // Auth user from lens api
      const auth = await authenticate({
        variables: {request: {address, signature}},
      })

      await setAuthTokenInLocalStorage(
        auth.data?.authenticate.accessToken,
        auth.data?.authenticate.refreshToken,
      )
      toast.success('Connected')

      const {data: profilesData} = await getProfiles({
        variables: {ownedBy: address},
      })

      if (profilesData?.profiles?.items?.length === 0) {
        setCurrentProfile(emptyProfile)
        setHasProfile(false)
        setUserSigNonce(0)
        setIsLoggedIn(false)

        toast('Kindly create a profile', {
          icon: '⏲',
        })
        navigate(PageRoutes.SIGN_UP)
        closeModal()
      } else {
        const profiles: any = profilesData?.profiles?.items
        const generateNonceResult = await generateNonce(profiles[0].handle, address, profiles[0].id)

        /* 
        If user doesn't exists on the backend but have a profile on the lens backend, 
        then we will create a new user profile on our backend
        */

        if (generateNonceResult === true) {
          const formBodyData = new FormData()
          formBodyData.append('username', profiles[0].handle)
          formBodyData.append('wallet_address', address)
          formBodyData.append('lens_profile', profiles[0].id)

          const createUserResult = await createUser(formBodyData)
          //now if user is created on backend then generate it nonce and token and make him/her login
          if (createUserResult) {
            const generateNonceResult = await generateNonce(
              profiles[0].handle,
              address,
              profiles[0].id,
            )
            verifyBackendGeneratedToken(generateNonceResult?.token, profilesData, closeModal)
          }
        }
        generateNonceResult?.token &&
          verifyBackendGeneratedToken(generateNonceResult?.token, profilesData, closeModal)
      }
    } catch (error: any) {
      setCurrentProfile(emptyProfile)
      setHasProfile(false)
      setUserSigNonce(0)
      setIsLoggedIn(false)
      closeModal()
      // navigate(PageRoutes.ERROR_PAGE);
    }
  }

  const closeModal = () => {
    setIsLoading(false)
    setIsHandleSignLoading(false)
  }

  useEffect(() => {
    address && setWalletAddress(address?.toLowerCase())
  }, [address, setWalletAddress])

  return (
    <Modal open={openModal} setOpen={setIsLoading}>
      <div>
        <div className='flex justify-between items-center border-b pb-2'>
          <p className='heading-5 sm:heading-5'>Login</p>
          <XMarkIcon
            className='w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1'
            onClick={() => setIsLoading(false)}
          />
        </div>
        {activeConnector?.id ? (
          chain?.id === config.chainId ? (
            <>
              <div className='my-3 text-left sm:mt-5'>
                <p className='paragraph-2 sm:paragraph-1'>Sign In with F3RN</p>
              </div>
              {isConnected && (
                <div className='w-full flex justify-end'>
                  <button
                    className='heading-6 w-full sm:w-auto px-3 py-2 sm:px-6 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none bg-primary'
                    onClick={() => handleSign(walletAddress, closeModal)}
                  >
                    {isHandleSignLoading ? (
                      <div className='w-[3vw]'>
                        <Loader />
                      </div>
                    ) : (
                      'Sign-In'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className='my-3 text-left sm:mt-5'>
                <p className='paragraph-2 sm:paragraph-1'>Switch your Network</p>
              </div>
              <div className='w-full flex justify-end'>
                <SwitchNetwork />
              </div>
            </>
          )
        ) : (
          <>
            <div className='my-3 text-left sm:mt-5'>
              <p className='paragraph-2 sm:paragraph-1'>Connect your wallet.</p>
            </div>
            {connectors.map(
              (connector) =>
                connector.id === 'metaMask' && (
                  <div className='w-full flex justify-end items-center' key={connector.id}>
                    <button
                      // disabled={!connector.ready}
                      className='heading-6 w-full sm:w-auto px-3 py-2 sm:px-6 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none bg-primary'
                      key={connector.id}
                      onClick={() =>
                        !connector.ready
                          ? window.open('https://metamask.io/download/', '_blank')
                          : connect({connector})
                      }
                    >
                      {isLoading ? (
                        <div className='w-[6vw]'>
                          <Loader />
                        </div>
                      ) : (
                        `${!connector.ready ? ' Install Metamask' : 'Browser Wallet'}`
                      )}
                    </button>
                  </div>
                ),
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

export default WalletConnector
