import React, { useEffect } from 'react'
import RNBootSplash from 'react-native-bootsplash'

import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { AuthRoutes, AuthStackParamList } from '@/modules/auth/routes'
import { useAuthStore } from '@/modules/auth/stores'
import { HomeRoutes, HomeStackParamList } from '@/modules/home/routes'
import { useThemeStore } from '@/shared/stores'
import { navigationRef } from '@/shared/utils/navigation-utilities'
import storage from '@/shared/utils/storage'

export type StackParamList = AuthStackParamList & HomeStackParamList

export type AppNavigationProp = StackNavigationProp<StackParamList>

export const AppRoutes: React.FC = function () {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const isDarkMode = useThemeStore(state => state.isDarkMode)
  const setUser = useAuthStore(state => state.setUser)

  useEffect(() => {
    const auth = storage.getAuth()
    console.log({ auth })
    if (auth) {
      setUser(auth).then()
    }
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isDarkMode ? DarkTheme : DefaultTheme}
      onReady={() => RNBootSplash.hide({ fade: true })}>
      {!isLoggedIn ? <AuthRoutes /> : <HomeRoutes />}
    </NavigationContainer>
  )
}
