import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import create from 'zustand'

import { hideLoading, showLoading } from '@/shared/utils/dialog'
import { delay } from '@/shared/utils/helpers'
import storage from '@/shared/utils/storage'

type State = {
  data: FirebaseAuthTypes.UserCredential | undefined
  isLoggedIn: boolean
}

type Action = {
  registerAction: () => Promise<void>
  checkLoggedInAction: () => void
  setUser: (data: FirebaseAuthTypes.UserCredential) => Promise<void>
  logOutAction: () => Promise<void>
}

export const useAuthStore = create<State & Action>(set => ({
  isLoggedIn: false,
  data: undefined,
  setUser: async (data: FirebaseAuthTypes.UserCredential) => {
    storage.saveAccessToken(data?.user?.uid)
    if (data?.user) {
      storage.saveAuth(data)
    }
    set(() => ({
      isLoggedIn: true,
      data,
    }))
  },
  registerAction: async () => {
    //
  },
  checkLoggedInAction: () => {
    set({
      isLoggedIn: !!storage.getAccessToken(),
    })
  },
  logOutAction: async () => {
    showLoading()
    await delay(1000)
    storage.saveAccessToken('')
    storage.saveAuth(null)
    set({
      isLoggedIn: false,
      data: undefined,
    })
    hideLoading()
  },
}))
