import {ethers} from 'ethers'
import {toast} from 'react-hot-toast'

export const signMessage = async (message: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    return signature
  } catch (error: any) {
    toast.error(error.message)
    throw new Error(error.message)
  }
}

export const setAuthTokenInLocalStorage = async (accessToken: string, refreshToken: string) => {
  try {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    return true
  } catch (error: any) {
    throw new Error('Login Failed')
  }
}

export const handleSignTypeData = async (typeData: any) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const {domain, types, value} = typeData
    const signature = await signer._signTypedData(domain, types, value)

    return signature
  } catch (error: any) {
    toast.error(error.message)
    throw new Error(error.message)
  }
}
