import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { StateStorage } from 'zustand/middleware'

import { mmkv } from './mmvk'

const KEYS = {
  TOKEN: '@TOKEN',
  AUTH: '@AUTH',
  THEME: '@THEME',
}

export const MMKVStorage: StateStorage = {
  getItem: (name: string) => mmkv.getString(name) || null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
}

const storage = {
  saveAccessToken: (data: string) => {
    mmkv.set(KEYS.TOKEN, data)
  },
  getAccessToken: () => {
    return mmkv.getString(KEYS.TOKEN)
  },
  saveAuth: (data: FirebaseAuthTypes.UserCredential | null) => {
    mmkv.set(KEYS.AUTH, JSON.stringify(data))
  },
  getAuth: (): FirebaseAuthTypes.UserCredential => {
    const auth = mmkv.getString(KEYS.AUTH)
    return auth ? JSON.parse(auth) : null
  },
}

export default storage
