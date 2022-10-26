import { createContext, useState, useEffect } from "react";

export const WalletContext = createContext({});

const WalletProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState("");

  // connect to metamask

  const connectToMetamask = async () => {
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
        console.log("account", account);
        setIsLoading(false);
      } catch (error: any) {
        console.log("error ==>", error, error.message);
        console.log(error.message);
        setIsLoading(false);
      }
    }
  };

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
          connectToMetamask,
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  );
};

export default WalletProvider;
