import { chain } from 'wagmi';

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' },
};
export const isMainNet = false;
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' },
};
const config = {
  lensUri: process.env.REACT_APP_LENS_API_URI ?? 'https://api.lens.dev',
  isMainNet,
  lensMumbaiUri: process.env.REACT_APP_LENS_API_MUMBAI_URI ?? 'https://api-mumbai.lens.dev',
  pinataJwt: process.env.REACT_APP_PINATA_JWT ?? '',
  w3StorageToken: process.env.REACT_APP_W3_STORAGE_TOKEN ?? '',
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY ?? 'https://lens.infura-ipfs.io/ipfs/',
  alchemyApiKey: process.env.REACT_APP_ALCHEMY_KEY ?? '',
  backendUri: process.env.REACT_APP_BACKEND_URI ?? '',
  backendUriLocal: process.env.REACT_APP_BACKEND_URI_LOCAL ?? '',
  alchemyMainRpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
  alchemyMumbaiRpc: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
  APP_NAME: 'F3RN',
  UPLOAD_MEDIA_END_POINT: '/upload-media/',
  CHAIN_ID: isMainNet ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id,
};
export const PageRoutes = {
  HOMEPAGE: '/',
  DISCOVERY: '/explore',
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
};
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/';

export default config;
