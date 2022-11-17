import { useLazyQuery, useMutation } from '@apollo/client';
import { createContext, useState, useEffect, useReducer } from 'react';
import { AuthenticateDocument, ChallengeDocument, UserProfilesDocument } from 'graphql/generated/types';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signMessage } from 'graphql/utils/signMessage';

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
import generateNonce, { getBackendProfile } from 'utils/generateNonce';
import clearStorage from 'utils/clearStorage';
import axios from 'axios';
import config, { DEFAULT_CHAIN_IDS, PageRoutes } from 'utils/config';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const WalletContext = createContext({});

const WalletProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const { switchNetwork } = useSwitchNetwork();

  var account = ''; //, setAccount] = useState('');
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

  const validateChain = async (account: string) => {
    const fetchChainId = window.ethereum.chainId;
    if (!DEFAULT_CHAIN_IDS.includes(fetchChainId)) {
      if (switchNetwork) {
        switchNetwork(config.CHAIN_ID);
        toast.error('Please change your network wallet!');
      }
    } else {
      handleSign(account);
    }
  };

  const connectToBrowserWallets = async () => {
    if (localStorage.getItem('accessToken') && hasProfileState.hasProfile === false)
      return navigate(PageRoutes.SIGN_UP);

    setIsLoading(true);

    if (window.ethereum === 'undefined') {
      toast.error('Please Install Metamask');
      return false;
    } else {
      try {
        dispatchAccount({ type: 'loading' });
        const accounts = await window.ethereum.request({
          // fetch metamask account ID/address
          method: 'eth_requestAccounts',
        });

        if (accounts.length !== 0) {
          dispatchAccount({ type: 'success', payload: accounts[0] });
          account = accounts[0];
          fetchWalletBalance(accounts[0]);
          validateChain(accounts[0]);
        } else toast.error('No account!!!');
        setIsLoading(false);
      } catch (error: any) {
        console.log('error', error, error.message);

        dispatchAccount({ type: 'error', payload: error });
        setIsLoading(false);
      }
    }
  };

  // get wallet balance
  const fetchWalletBalance = async (account: string) => {
    try {
      dispatchWalletBalance({ type: 'loading' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      const balanceInEth = ethers.utils.formatEther(balance);
      dispatchWalletBalance({ type: 'success', payload: balanceInEth });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('error occurred', error);
      }
      dispatchWalletBalance({ type: 'error', payload: error });
    }
  };
  // Is wallet is connected

  const handleAutoConnectWallet = () => {
    if (window.ethereum) {
      // window.ethereum
      //   .request({ method: 'eth_accounts' })
      //   .then(handleAccountsChanged)
      //   .catch((err: any) => {
      //     console.log(err, 'Not Connected');
      //   });

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return true;
    } else {
      return false;
    }
  };

  async function handleAccountsChanged() {
    const accounts = await window.ethereum.request({
      // fetch metamask account ID/address
      method: 'eth_requestAccounts',
    });
    if (accounts.length === 0) {
      dispatchAccount({ type: 'success', payload: '' });
      dispatchIsLoggedIn({ type: 'success', payload: false });
      clearStorage();
      connectToBrowserWallets();
    } else if (accounts[0] !== accountState.account) {
      dispatchAccount({ type: 'success', payload: accounts[0] });
      dispatchIsLoggedIn({ type: 'success', payload: false });
      clearStorage();
      connectToBrowserWallets();
    }
  }

  //signMessage

  const handleSign = async (address: string) => {
    try {
      // Get challenge
      dispatchHasProfile({ type: 'loading' });
      dispatchCurrentProfile({ type: 'loading' });
      dispatchUserSigNonce({ type: 'loading' });
      dispatchIsLoggedIn({ type: 'loading' });
      const challenge = await loadChallenge({
        variables: { request: { address } },
      });
      if (!challenge?.data?.challenge?.text) {
        return toast.error('Signature message is not valid');
      }
      // Get signature
      const signature = await signMessage(challenge?.data?.challenge?.text);

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } },
      });
      toast.success('Connected');

      localStorage.setItem('accessToken', auth.data?.authenticate.accessToken);
      localStorage.setItem('refreshToken', auth.data?.authenticate.refreshToken);

      // dispatchIsLoggedIn({ type: 'success', payload: true });
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
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
      } else {
        const profiles: any = profilesData?.profiles?.items;

        const generateNonceResult = await generateNonce(profiles[0].handle, account, profiles[0].id);

        if (generateNonceResult?.token) {
          const token = localStorage.getItem('backendToken');
          const getProfileResult = await getBackendProfile(token);
          console.log('getProfileResult', getProfileResult);
          dispatchCurrentProfile({
            type: 'success',
            payload: { ...profiles[0], approvalStatus: getProfileResult?.artist_approval_status },
          });
          dispatchIsLoggedIn({ type: 'success', payload: true });
          dispatchHasProfile({ type: 'success', payload: true });
          dispatchUserSigNonce({
            type: 'success',
            payload: { userSignNonce: profilesData?.userSigNonces?.lensHubOnChainSigNonce },
          });
        } else {
          dispatchIsLoggedIn({ type: 'error', payload: 'error' });
          navigate(PageRoutes.SOMETHING_WENT_WRONG);
        }
      }
    } catch (error) {
      // dispatchSignature({ type: 'error', payload:  error } );
      console.log(error);
      dispatchHasProfile({ type: 'error', payload: error });
      dispatchCurrentProfile({ type: 'error', payload: error });
      dispatchUserSigNonce({ type: 'error', payload: error });
      dispatchIsLoggedIn({ type: 'error', payload: error });
      navigate(PageRoutes.SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    // handleAutoConnectWallet();
  }, []);
  useEffect(() => {
    window.ethereum.on('chainChanged', () => {
      dispatchIsLoggedIn({ type: 'success', payload: false });
      clearStorage();
      navigate('/');
    });
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
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  );
};

export default WalletProvider;
