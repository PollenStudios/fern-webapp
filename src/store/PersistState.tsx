import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import clearStorage from 'utils/clearStorage';
import parseJwt from 'utils/parseJwt';

import { useLazyQuery } from '@apollo/client';
import { UserProfilesDocument, VerifyDocument } from 'graphql/generated/types';
import { useNavigate } from 'react-router-dom';
import { getBackendProfile } from 'utils/generateNonce';
import { PageRoutes } from 'utils/config';
// import { useLocation } from 'react-router-dom';

const PersistState = ({ children }: any) => {
  // const { pathname } = useLocation();
  const navigate = useNavigate();
  const [verify] = useLazyQuery(VerifyDocument);

  const [getProfiles] = useLazyQuery(UserProfilesDocument);

  const {
    setIsLoading,
    isLoggedIn,
    dispatchAccount,
    dispatchWalletBalance,
    dispatchHasProfile,
    dispatchUserSigNonce,
    dispatchCurrentProfile,
    dispatchIsLoggedIn,
  }: any = useContext(WalletContext);

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
  const handleSign = async (address: string) => {
    try {
      // Get challenge
      dispatchHasProfile({ type: 'loading' });
      dispatchCurrentProfile({ type: 'loading' });
      dispatchUserSigNonce({ type: 'loading' });

      // Get authenticated profiles

      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        // setHasProfile(false);
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
        // toast.success('Kindly create a profile');
        navigate(PageRoutes.SIGN_UP);
      } else {
        dispatchHasProfile({ type: 'success', payload: true });

        dispatchIsLoggedIn({ type: 'success', payload: true });
        const profiles: any = profilesData?.profiles?.items;
        const getProfileResult = await getBackendProfile();

        dispatchCurrentProfile({
          type: 'success',
          payload: { ...profiles[0], approvalStatus: getProfileResult?.artist_approval_status },
        });
        dispatchUserSigNonce({
          type: 'success',
          payload: { userSignNonce: profilesData?.userSigNonces?.lensHubOnChainSigNonce },
        });
      }
    } catch (error) {
      dispatchHasProfile({ type: 'error', payload: error });
      dispatchCurrentProfile({ type: 'error', payload: error });
      dispatchUserSigNonce({ type: 'error', payload: error });
      dispatchIsLoggedIn({ type: 'error', payload: error });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const accessToken = localStorage.getItem('accessToken')! as string;
      if (!accessToken || accessToken === 'undefined') {
        clearStorage();
        dispatchIsLoggedIn({ type: 'success', payload: false });
        // toast.error('kindly Connect Again');
        return;
      }
      const isExpired = Date.now() >= parseJwt(accessToken)?.exp * 1000;
      if (isExpired) {
        clearStorage();
        dispatchIsLoggedIn({ type: 'success', payload: false });
        // toast.error('kindly Connect Again');
        return;
      }
      verifyToken(accessToken);
      const fetchUserData = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          if (accounts.length !== 0) {
            dispatchAccount({ type: 'success', payload: accounts[0] });
          }
          handleSign(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          const balanceInEth = ethers.utils.formatEther(balance);
          dispatchWalletBalance({ type: 'success', payload: balanceInEth });
        } catch (error: any) {
          console.log('error', error);
          dispatchAccount({ type: 'error', payload: error });
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, []);

  return <div>{children}</div>;
};

export default PersistState;
