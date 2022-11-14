import { InjectedConnector } from 'wagmi/connectors/injected';
import { chain, configureChains, createClient } from 'wagmi';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import config from './config';

const { chains, provider } = configureChains(
  [config.isMainNet ? chain.polygon : chain.polygonMumbai],
  [alchemyProvider({ apiKey: config.alchemyApiKey })],
);

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: false },
    }),
    new WalletConnectConnector({
      chains,
      options: { rpc: { [config.isMainNet ? chain.polygon.id : chain.polygonMumbai.id]: config.alchemyMainRpc } },
    }),
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;
