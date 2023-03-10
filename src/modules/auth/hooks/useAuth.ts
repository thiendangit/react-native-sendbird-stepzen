import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { useAuthStore } from '../stores'
import { LoginPayload } from '../types'
import { useFirebase } from '@/context/firebaseContext'
import { AppNavigationProp } from '@/routes'
import { hideLoading, showLoading } from '@/shared/utils/dialog'

export const useAuth = () => {
  const navigation = useNavigation<AppNavigationProp>()
  const { setUser } = useAuthStore()
  const { loginFB } = useFirebase()
  const { registerFB } = useFirebase()

  const [t] = useTranslation()

  const goToLogin = useCallback(() => {
    navigation.navigate('login')
  }, [navigation])

  const goToRegister = useCallback(() => {
    navigation.navigate('register')
  }, [navigation])

  const login = useCallback(
    async (data: LoginPayload) => {
      try {
        showLoading()
        const res = await loginFB?.(data?.email, data?.password)
        if (res) {
          await setUser(res)
        }
        hideLoading()
      } catch (e: any) {
        Alert.alert(t('Login fail'), e?.message, [{ text: 'OK', onPress: () => '' }])
        hideLoading()
      }
    },
    [loginFB, setUser, t],
  )

  const register = useCallback(
    async (displayName: string, email: string, password: string) => {
      try {
        showLoading()
        await registerFB?.(displayName, email, password)
        hideLoading()
        Alert.alert(t('auth:register_successfully'), t('auth:thanks_for_your_registration'), [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      } catch (e: any) {
        hideLoading()
        Alert.alert(t('Register fail'), e?.message, [{ text: 'OK', onPress: () => undefined }])
      }
    },
    [navigation, registerFB, t],
  )

  return { goToLogin, goToRegister, login, register }
}
