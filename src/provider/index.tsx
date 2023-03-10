import React, { useEffect, useMemo } from 'react'
import { Alert } from 'react-native'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ModalPortal } from 'react-native-modals'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ThemeProvider } from '@shopify/restyle'
import { TailwindProvider } from 'tailwind-rn'

import utilities from '../../tailwind.json'
import { FirebaseProvider } from '@/context/firebaseContext'
import { useAuthStore } from '@/modules/auth/stores'
import { ErrorBoundary } from '@/modules/error/components'
import { AppRoutes } from '@/routes'
import { useBarStyle } from '@/shared/hooks'
import { useThemeStore } from '@/shared/stores'
import { darkTheme, lightTheme } from '@/shared/themes'
import { EventRegister, EVENTS } from '@/shared/utils/event-register'

export const AppProvider: React.FC = function () {
  useBarStyle()
  const checkLoggedIn = useAuthStore(state => state.checkLoggedInAction)
  const isDarkMode = useThemeStore(state => state.isDarkMode)
  const theme = useMemo(() => (!isDarkMode ? darkTheme : lightTheme), [isDarkMode])

  useEffect(() => {
    checkLoggedIn()
    EventRegister.on(EVENTS.EVENT_LOGOUT, () => {
      Alert.alert("I'm an event!")
    })
  }, [checkLoggedIn])

  return (
    <FirebaseProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ErrorBoundary catchErrors="dev">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <TailwindProvider utilities={utilities}>
              <AppRoutes />
            </TailwindProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
        <ModalPortal />
      </ThemeProvider>
    </FirebaseProvider>
  )
}
