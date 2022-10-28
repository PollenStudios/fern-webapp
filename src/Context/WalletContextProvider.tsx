import { useLazyQuery, useMutation } from "@apollo/client";
import { createContext, useState, useEffect } from "react";
import { AuthenticateDocument, ChallengeDocument, RecommendedProfilesDocument } from "../Generated/types";
import { ethers } from "ethers";

export const WalletContext = createContext({});

const WalletProvider = ({ children }: any) => {
  const [loadChallenge, { error: errorChallenge, loading: challengeLoading }] = useLazyQuery(ChallengeDocument, {
    fetchPolicy: "no-cache",
  });
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] = useMutation(AuthenticateDocument);
  const [recommendedProfiles, { error: errorProfiles, loading: profilesLoading }] = useLazyQuery(RecommendedProfilesDocument);

  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState("");

  const [account, setAccount] = useState<any>("");
  const [isLogedin, setIsLogedin] = useState(false);
  const [recommendedProfilesData, setRecommendedProfilesData] = useState<Object[]>();

  // connect to Wallet

  const connectToBrowserWallets = async () => {
    setIsLoading(true);
    if (window.ethereum === "undefined") {
      console.log("Please Install Metamask");
      return false;
    } else {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
          setAccount(accounts[0]);
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const balance = await provider.getBalance(accounts[0]);
        const balanceInEth = ethers.utils.formatEther(balance);
        setWalletBalance(balanceInEth);
        handleSign(accounts[0]);
        setIsLoading(false);
      } catch (error: any) {
        console.log("error ==>", error, error.message);
        console.log(error.message);
        setIsLoading(false);
      }
    }
  };

  // Is wallet is connected

  const handleAutoConnectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(handleAccountsChanged)
        .catch((err: any) => {
          console.log(err, "Not Connected");
        });

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return true;
    } else {
      return false;
    }
  };

  function handleAccountsChanged(accounts: any) {
    if (accounts.length === 0) {
      setAccount("");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  }

  //signMessage

  const signMessage = async (message: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSign = async (address: string) => {
    try {
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } },
      });

      //if challenge message is not available
      if (!challenge?.data?.challenge?.text) {
        return console.log("Signature message is not valid");
      }

      // Get signature
      const signature = await signMessage(challenge?.data?.challenge?.text);

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } },
      });
      localStorage.setItem("accessToken", auth.data?.authenticate.accessToken);
      localStorage.setItem("refreshToken", auth.data?.authenticate.refreshToken);

      const { data } = await recommendedProfiles();
      setRecommendedProfilesData(data?.recommendedProfiles);
      // TODO: Below code is for get default profiles query
      // Get authed profiles
      // const { data: profilesData } = await getProfiles({
      //   variables: { ownedBy: address },
      // });
      // const profilesData = await Client.query(DefaultProfile, {
      //   variables: {
      //     address:'',
      //   },
      // });

      setIsLogedin(true);
    } catch {}
  };

  useEffect(() => {
    handleAutoConnectWallet();
  }, []);

  return (
    <>
      <WalletContext.Provider
        value={{
          isLoading,

          // Local Storage Variable
          account,
          setAccount,
          connectToBrowserWallets,
          walletBalance,
          isLogedin,
          setIsLogedin,
          recommendedProfilesData,
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  );
};

export default WalletProvider;
