import { chain } from 'wagmi';

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' },
};
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' },
};

// const networkData = getNetworkDetails(process.env.network)

// getNetworkDetails = () =>{

//   return
// }

const config = {
  lensUri: process.env.REACT_APP_LENS_API_URI ?? 'https://api.lens.dev',
  isMainNet: process.env.REACT_APP_IS_MAINNET === 'true', //this condition gives false, so that we can use mumbai
  lensMumbaiUri: process.env.REACT_APP_LENS_API_MUMBAI_URI ?? 'https://api-mumbai.lens.dev',
  pinataJwt: process.env.REACT_APP_PINATA_JWT ?? '',
  w3StorageToken: process.env.REACT_APP_W3_STORAGE_TOKEN ?? '',
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY ?? 'https://lens.infura-ipfs.io/ipfs/',
  alchemyApiKey: process.env.REACT_APP_ALCHEMY_KEY ?? '',
  baseUrl: process.env.REACT_APP_BACKEND_URI ?? '',
  baseUrlLocal: process.env.REACT_APP_BACKEND_URI_LOCAL ?? '',
  alchemyMainRpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
  alchemyMumbaiRpc: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
  public_Key: process.env.REACT_APP_BACKEND_PUBLIC_KEY,
  appName: process.env.REACT_APP_APP_NAME,
  appNameForLensApi: process.env.REACT_APP_APP_NAME_TO_GET_DATA_FROM_LENS,
  chainId: process.env.REACT_APP_IS_MAINNET === 'true' ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id,
};
export const PageRoutes = {
  HOMEPAGE: '/',
  DISCOVERY: '/discover',
  USER_PROFILE: '/user/:id',
  SETTINGS: '/settings',
  ART_PREVIEW: '/art/:id',
  UPLOAD_ART: '/upload-art',
  SIGN_UP_ARTIST: '/sign-up-artist',
  SIGN_UP: '/sign-up',
  CREATE_POST: '/create-post',
  PRIVACY_POLICY: '/privacy-policy',
  THANKYOU: '/thankyou',
  ENABLE_DISPATCHER: '/enable-dispatcher',
  ERROR_PAGE: '/something-went-wrong',
  SEARCH: '/search',
};

export const DEFAULT_CHAIN_IDS = ['0x13881', 80001, '80001'];

export default config;
