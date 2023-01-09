import type {Profile} from 'graphql/generated/types'
import config from 'utils/config'
import create from 'zustand'
import {persist} from 'zustand/middleware'

interface AppState {
  hasProfile: boolean
  setHasProfile: (hasProfile: boolean) => void
  currentProfile: Profile | null
  setCurrentProfile: (currentProfile: Profile) => void
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
  walletAddress: string
  setWalletAddress: (walletAddress: string) => void
  walletBalance: string
  setWalletBalance: (walletBalance: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  isHandleSignLoading: boolean
  setIsHandleSignLoading: (isHandleSignLoading: boolean) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      hasProfile: false,
      loading: false,
      // handleSign,
      error: '',
      setHasProfile: (hasProfile) => set(() => ({hasProfile})),
      currentProfile: null,
      setCurrentProfile: (currentProfile) => set(() => ({currentProfile})),
      userSigNonce: 0,
      setUserSigNonce: (userSigNonce) => set(() => ({userSigNonce})),
      walletAddress: '',
      setWalletAddress: (walletAddress) => set(() => ({walletAddress})),
      walletBalance: '',
      setWalletBalance: (walletBalance) => set(() => ({walletBalance})),
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set(() => ({isLoggedIn})),
      isHandleSignLoading: false,
      setIsHandleSignLoading: (isHandleSignLoading) => set(() => ({isHandleSignLoading})),
    }),
    {name: config.f3rnStore},
  ),
)
