import { ethers } from 'ethers';
import { useContext, useEffect, useRef } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import clearStorage from 'utils/clearStorage';
import parseJwt from 'utils/parseJwt';

import { useLazyQuery } from '@apollo/client';
import { UserProfilesDocument, VerifyDocument } from 'graphql/generated/types';
import { useNavigate } from 'react-router-dom';
import { getBackendProfile } from 'utils/generateNonce';
import { PageRoutes } from 'utils/config';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
// import { useLocation } from 'react-router-dom';

const PersistState = ({ children }: any) => {
  // const { pathname } = useLocation();
  const walletProvider = useRef(window.ethereum);

  const { address } = useAccount();
  const navigate = useNavigate();
  const [verify] = useLazyQuery(VerifyDocument);

  const [getProfiles] = useLazyQuery(UserProfilesDocument);

  const token = localStorage.getItem('backendToken');
  const {
    setIsLoading,
    isLoggedInState: { isLoggedIn },
    dispatchAccount,
    dispatchWalletBalance,
    dispatchHasProfile,
    dispatchUserSigNonce,
    dispatchCurrentProfile,
    dispatchIsLoggedIn,
  }: any = useContext(WalletContext);

  const logout = () => {
    clearStorage();
    dispatchIsLoggedIn({ type: 'success', payload: false });
  };

  const verifyToken = async (token: string) => {
    try {
      const { data } = await verify({
        variables: {
          request: {
            accessToken: token,
          },
        },
      });
      // dispatchIsLoggedIn({ type: 'success', payload: data?.verify });
    } catch (error) {
      console.log(error);
    }
  };
  const verifyProfileForLogin = async (address: string | undefined) => {
    try {
      dispatchHasProfile({ type: 'loading' });
      dispatchCurrentProfile({ type: 'loading' });
      dispatchUserSigNonce({ type: 'loading' });

      //get all profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        dispatchHasProfile({ type: 'success', payload: false });

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
        // navigate(PageRoutes.SIGN_UP);
      } else if (token && token !== 'undefined') {
        dispatchHasProfile({ type: 'success', payload: true });
        dispatchIsLoggedIn({ type: 'success', payload: true });

        const profiles: any = profilesData?.profiles?.items;
        const getProfileResult = await getBackendProfile();

        dispatchCurrentProfile({
          type: 'success',
          payload: { ...profiles[0], artistApprovalStatus: getProfileResult?.artist_approval_status },
        });
        dispatchUserSigNonce({
          type: 'success',
          payload: { userSignNonce: profilesData?.userSigNonces?.lensHubOnChainSigNonce },
        });
      } else {
        dispatchHasProfile({ type: 'success', payload: true });
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
        dispatchIsLoggedIn({ type: 'success', payload: false });
        // toast.error('No profile found');
      }
    } catch (error) {
      dispatchHasProfile({ type: 'error', payload: error });
      dispatchCurrentProfile({ type: 'error', payload: error });
      dispatchUserSigNonce({ type: 'error', payload: error });
      dispatchIsLoggedIn({ type: 'error', payload: error });
      toast.error('Something went wrong');
      navigate(PageRoutes.ERROR_PAGE);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken || accessToken === 'undefined') {
        logout();
        return;
      }

      const isExpired = Date.now() >= parseJwt(accessToken)?.exp * 1000;
      if (isExpired) {
        logout();
        return;
      }

      verifyToken(accessToken);

      const fetchUserData = async () => {
        try {
          const accountAddress = address?.toLowerCase();

          if (accountAddress?.length !== 0) {
            dispatchAccount({ type: 'success', payload: accountAddress });
          }

          verifyProfileForLogin(accountAddress);

          const provider = new ethers.providers.Web3Provider(walletProvider.current);
          //@ts-ignore
          const balance = await provider.getBalance(accountAddress);
          const balanceInEth = ethers.utils.formatEther(balance);
          dispatchWalletBalance({ type: 'success', payload: balanceInEth });
        } catch (error: any) {
          dispatchAccount({ type: 'error', payload: error });
          setIsLoading(false);
          console.log({ error });
          // toast.error('Something went wrong');
        }
      };

      fetchUserData();
    }
  }, []);

  return <div>{children}</div>;
};

export default PersistState;
