import {apiRoutes} from 'API/apiRoutes'
import axios from 'axios'
import forge from 'node-forge'
import toast from 'react-hot-toast'
import config from './config'
import {backendToken} from './getBackendToken'

// Create Login Nonce on the backend
const BASE_URL = config.baseUrl

const generateNonce = async (userName: string, walletAddress: string, profileId: string) => {
  try {
    const {
      data: {otp},
    } = await axios({
      method: 'post',
      url: BASE_URL + apiRoutes.generateNonce,
      data: {
        username: userName,
        wallet_address: walletAddress,
        lens_profile: profileId,
      },
    })

    const publicKey = forge.pki.publicKeyFromPem(config?.public_Key || '')

    const secretMessage = `${userName}@${profileId}@${otp}`

    const encrypted = publicKey.encrypt(secretMessage, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(secretMessage),
    })
    const base64 = forge.util.encode64(encrypted)

    const generateTokenResult = await generateToken(base64, walletAddress)

    localStorage.setItem('backendToken', generateTokenResult.token)

    return generateTokenResult
  } catch (error: any) {
    const {
      response: {
        data: {message},
      },
    } = error
    if (message === 'user does not exists') return true
    else console.log('else', message)
  }
}
const generateToken = async (key: string, walletAddress: string) => {
  try {
    const {data} = await axios({
      method: 'post',
      url: BASE_URL + apiRoutes.generateToken,
      data: {
        encoded_data: key,
        wallet_address: walletAddress,
      },
    })
    return data
  } catch (error) {
    console.log(error)
    toast.error('login is not successful')
    return error
  }
}
export const createUser = async (formData: FormData) => {
  try {
    const data = await axios({
      method: 'post',
      url: BASE_URL + apiRoutes.userProfile,
      data: formData,
    })
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const userProfileLens = async (id: string | undefined) => {
  try {
    const {data} = await axios({
      method: 'get',
      url: BASE_URL + apiRoutes.userProfile + id + '/',
    })
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getBackendProfile = async () => {
  try {
    const {data} = await axios({
      method: 'get',
      url: BASE_URL + apiRoutes.userProfileMe,
      headers: {
        Authorization: `TOKEN ${backendToken()}`,
      },
    })
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getArtCategories = async () => {
  try {
    const {data} = await axios({
      method: 'get',
      url: BASE_URL + apiRoutes.artCategories,
    })
    return data.map((item: {name: string}) => item.name)
  } catch (error) {
    console.log(error)
    return error
  }
}
export default generateNonce
