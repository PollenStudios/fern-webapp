import {toast} from 'react-hot-toast'
import {Web3Storage} from 'web3.storage'
import config from './config'
import {Buffer} from 'buffer'

function makeStorageClient() {
  return new Web3Storage({
    token: config.w3StorageToken,
  })
}

async function storeFiles(dataObject: any) {
  try {
    const buffer = Buffer.from(JSON.stringify(dataObject))
    const files = [new File([buffer], `hello.json`)]
    const client = makeStorageClient()
    const cid = await client.put(files)
    // toast.success('File Successfully Stored on Web3');
    return cid
  } catch (error) {
    toast.error('Error storing File on web3')
    console.log(error)
  }
}
export default storeFiles
