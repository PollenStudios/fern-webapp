import { InjectedConnector } from 'wagmi/connectors/injected';
import { chain, configureChains, createClient } from 'wagmi';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import config from './config';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

//using jsonrpcprovider now and alchemyprovider is commented for now
const { chains, provider } = configureChains(
  [config.isMainNet ? chain.polygon : chain.polygonMumbai],
  // [alchemyProvider({ apiKey: config.alchemyApiKey })],
  [jsonRpcProvider({ rpc: () => ({ http: config.rpcUrl }) })],
);

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: false },
    }),
    new WalletConnectConnector({
      chains,
      // options: { rpc: { [config.isMainNet ? chain.polygon.id : chain.polygonMumbai.id]: config.alchemyMainRpc } },
      options: { rpc: { [config.isMainNet ? chain.polygon.id : chain.polygonMumbai.id]: config.rpcUrl } },
    }),
    new MetaMaskConnector({
      chains,
    }),
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;
