import { createContext, useState } from 'react';

export const WalletContext = createContext({});

const WalletProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <WalletContext.Provider
        value={{
          isLoading,
          // Local Storage Variable
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  );
};

export default WalletProvider;
