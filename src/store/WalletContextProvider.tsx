import { useLazyQuery, useMutation } from '@apollo/client';
import { createContext, useState, useEffect, useReducer, useRef } from 'react';
import { AuthenticateDocument, ChallengeDocument, UserProfilesDocument } from 'graphql/generated/types';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { setAuthTokenInLocalStorage, signMessage } from 'graphql/utils/signMessage';

import {
  initialStateAccount,
  initialStateCurrentProfile,
  initialStateHasProfile,
  initialStateIsLoggedIn,
  initialStateUserSigNonce,
  initialStateWalletBalance,
  reducerAccount,
  reducerCurrentProfile,
  reducerHasProfile,
  reducerIsLoggedIn,
  reducerUserSigNonce,
  reducerWalletBalance,
} from 'utils/useReducer';
import generateNonce, { createUser, getBackendProfile } from 'utils/generateNonce';
import clearStorage from 'utils/clearStorage';

import config, { DEFAULT_CHAIN_IDS, PageRoutes } from 'utils/config';
import { useSwitchNetwork } from 'wagmi';

export const WalletContext = createContext({});

const WalletProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const { switchNetwork } = useSwitchNetwork();

  // const [account, setAccount] = useState('');
  const [loadChallenge] = useLazyQuery(ChallengeDocument, {
    fetchPolicy: 'no-cache',
  });
  const [authenticate] = useMutation(AuthenticateDocument);
  const [getProfiles] = useLazyQuery(UserProfilesDocument);

  const [isLoading, setIsLoading] = useState(false);

  const [walletBalanceState, dispatchWalletBalance] = useReducer(reducerWalletBalance, initialStateWalletBalance);

  const [accountState, dispatchAccount] = useReducer(reducerAccount, initialStateAccount);
  const [hasProfileState, dispatchHasProfile] = useReducer(reducerHasProfile, initialStateHasProfile);
  const [userSigNonceState, dispatchUserSigNonce] = useReducer(reducerUserSigNonce, initialStateUserSigNonce);
  const [currentProfileState, dispatchCurrentProfile] = useReducer(reducerCurrentProfile, initialStateCurrentProfile);
  const [isLoggedInState, dispatchIsLoggedIn] = useReducer(reducerIsLoggedIn, initialStateIsLoggedIn);

  const walletProvider = useRef(window.ethereum);

  const verifyBackendGeneratedToken = async (token: string, profilesData: any, closeModal: any) => {
    if (token) {
      const getProfileResult = await getBackendProfile();
      dispatchCurrentProfile({
        type: 'success',
        payload: {
          ...profilesData?.profiles?.items[0],
          artistApprovalStatus: getProfileResult?.artist_approval_status,
        },
      });
      dispatchIsLoggedIn({ type: 'success', payload: true });
      dispatchHasProfile({ type: 'success', payload: true });
      dispatchUserSigNonce({
        type: 'success',
        payload: { userSignNonce: profilesData?.userSigNonces?.lensHubOnChainSigNonce },
      });
      closeModal();
    }
  };

  const connectToBrowserWallets = async (infoModal: any, closeModal: any) => {
    //user is connected but not have a profile
    // if (localStorage.getItem('accessToken') && hasProfileState.hasProfile === false) {
    //   closeModal();
    //   return navigate(PageRoutes.SIGN_UP);
    // }
    setIsLoading(true);

    try {
      if (window.ethereum === undefined) {
        infoModal({
          heading: "You don't have Metamask",
          paragraph: 'Please install Metamask',
          primaryButtonText: 'Install Metamask',
          websiteUrl: 'https://metamask.io/download/',
        });

        throw new Error('Metamask is not installed');
      }

      dispatchAccount({ type: 'loading' });
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        toast.error('No account found');
        return false;
      }

      walletProvider.current = window.ethereum;
      dispatchAccount({ type: 'success', payload: accounts[0] });

      fetchWalletBalance(accounts[0]);

      await validateChain(accounts[0], closeModal, infoModal);

      // infoModal({
      //   heading: 'Sign-in with F3RN',
      //   paragraph: 'Please sign with your wallet',
      //   primaryButtonText: 'Sign wallet',
      //   onClick: await handleSign(accounts[0], closeModal, infoModal),
      // });

      await handleSign(accounts[0], closeModal, infoModal);
    } catch (error: any) {
      toast.error(error.message);
      dispatchAccount({ type: 'error', payload: error });
    } finally {
      setIsLoading(false);
    }
  };

  // get wallet balance
  const fetchWalletBalance = async (address: string) => {
    try {
      dispatchWalletBalance({ type: 'loading' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.utils.formatEther(balance);
      dispatchWalletBalance({ type: 'success', payload: balanceInEth });
    } catch (error) {
      console.log('error occurred', error);
      dispatchWalletBalance({ type: 'error', payload: error });
    }
  };

  //signMessage
  const handleSign = async (address: string, closeModal: any, infoModal: any) => {
    dispatchHasProfile({ type: 'loading' });
    dispatchCurrentProfile({ type: 'loading' });
    dispatchUserSigNonce({ type: 'loading' });
    dispatchIsLoggedIn({ type: 'loading' });

    try {
      // Fetch challenge from lens
      const challenge = await loadChallenge({
        variables: { request: { address } },
      });

      // If user is not able to get the challenge from Lens api
      if (!challenge?.data?.challenge?.text) {
        infoModal({
          heading: 'Signature message is not valid',
          paragraph: 'Signature message is not valid',
          buttonText: 'Retry again',
        });
        throw new Error('Lens login is not completed');
      }

      // Sign User wallet message
      const signature = await signMessage(challenge?.data?.challenge?.text);

      // Auth user from lens api
      const auth = await authenticate({
        variables: { request: { address, signature } },
      });

      await setAuthTokenInLocalStorage(auth.data?.authenticate.accessToken, auth.data?.authenticate.refreshToken);
      toast.success('Connected');

      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        // TODO: Refactor
        dispatchHasProfile({ type: 'success', payload: false });
        dispatchIsLoggedIn({ type: 'success', payload: false });
        dispatchCurrentProfile({
          type: 'success',
          payload: {
            currentProfile: {},
          },
        });
        dispatchUserSigNonce({
          type: 'success',
          payload: '',
        });
        toast('Kindly create a profile', {
          icon: '⏲',
        });
        navigate(PageRoutes.SIGN_UP);
        closeModal();
      } else {
        const profiles: any = profilesData?.profiles?.items;
        const generateNonceResult = await generateNonce(profiles[0].handle, address, profiles[0].id);

        /* 
        If user doesn't exists on the backend but have a profile on the lens backend, 
        then we will create a new user profile on our backend
        */

        if (generateNonceResult === true) {
          const formBodyData = new FormData();
          formBodyData.append('username', profiles[0].handle);
          formBodyData.append('wallet_address', address);
          formBodyData.append('lens_profile', profiles[0].id);

          const createUserResult = await createUser(formBodyData);
          //now if user is created on backend then generate it nonce and token and make him/her login
          if (createUserResult) {
            const generateNonceResult = await generateNonce(profiles[0].handle, address, profiles[0].id);
            verifyBackendGeneratedToken(generateNonceResult?.token, profilesData, closeModal);
          }
        }
        generateNonceResult?.token && verifyBackendGeneratedToken(generateNonceResult?.token, profilesData, closeModal);
      }
    } catch (error: any) {
      dispatchHasProfile({ type: 'error', payload: error });
      dispatchCurrentProfile({ type: 'error', payload: error });
      dispatchUserSigNonce({ type: 'error', payload: error });
      dispatchIsLoggedIn({ type: 'error', payload: error });
      // closeModal();
      // navigate(PageRoutes.ERROR_PAGE);
    }
  };
  //check chain id
  // some times user can login with chain id other than mumbai, check it why is it so
  const validateChain = async (address: string, closeModal: any, infoModal: any) => {
    const fetchChainId = walletProvider.current.chainId;
    if (!DEFAULT_CHAIN_IDS.includes(fetchChainId)) {
      if (switchNetwork) {
        infoModal({
          heading: 'Switch your Network',
          paragraph: 'Please switch your network chain',
          primaryButtonText: 'Switch Network',
          onClick: switchNetwork(config.chainId),
        });

        throw new Error('Chain network is not correct');
      }
    } else {
      return true;
    }
  };

  //Auto connect wallet

  const handleAutoConnectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: any) => {
          dispatchAccount({ type: 'success', payload: accounts[0] });
          fetchWalletBalance(accounts[0]);
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            toast.error(error.message);
          }
          // console.log(error, 'Not Connected');
        });
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    dispatchIsLoggedIn({ type: 'success', payload: false });
    dispatchCurrentProfile({ type: 'success', payload: {} });
    clearStorage();
    navigate(PageRoutes.DISCOVERY);
  };

  useEffect(() => {
    walletProvider?.current?.on('accountsChanged', () => {
      logout();
    });
  }, [walletProvider?.current?.selectedAddress]);

  useEffect(() => {
    walletProvider?.current?.on('chainChanged', () => {
      logout();
    });
  }, [walletProvider?.current?.chainId]);

  useEffect(() => {
    handleAutoConnectWallet();
  }, []);

  return (
    <>
      <WalletContext.Provider
        value={{
          isLoading,
          setIsLoading,
          accountState,
          dispatchAccount,
          walletBalanceState,
          dispatchWalletBalance,
          hasProfileState,
          dispatchHasProfile,
          userSigNonceState,
          dispatchUserSigNonce,
          currentProfileState,
          dispatchCurrentProfile,
          isLoggedInState,
          dispatchIsLoggedIn,
          connectToBrowserWallets,
          validateChain,
          handleSign,
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  );
};

export default WalletProvider;
