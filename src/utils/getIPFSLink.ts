import config from './config'

const getIPFSLink = (hash: string): string => {
  const gateway = config.ipfsGateway

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
    .replace('https://ipfs.io/ipfs/', gateway)
    .replace('ipfs://', gateway)
}

export default getIPFSLink
