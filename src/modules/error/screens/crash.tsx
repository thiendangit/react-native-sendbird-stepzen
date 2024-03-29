import React, { useCallback } from 'react'
import RNRestart from 'react-native-restart'

import { Button, Center, Screen, Space, Text } from '@/components/widgets'
import { useThemeStore } from '@/shared/stores'

type IProps = {
  error: Error
  resetError: () => void
}

export const Crash: React.FC<IProps> = function ({ error, resetError }) {
  const handleResetApp = useCallback(() => {
    resetError()
    RNRestart.Restart()
  }, [resetError])

  const isDarkMode = useThemeStore(state => state.isDarkMode)

  return (
    <Screen>
      <Center flex={1}>
        <Text>{__DEV__ ? error.toString() : 'Oops!'}</Text>
        <Space height={32} />
        <Button
          onPress={handleResetApp}
          backgroundColor={isDarkMode ? 'light' : 'dark'}
          labelColor={!isDarkMode ? 'light' : 'dark'}>
          Reset App
        </Button>
      </Center>
    </Screen>
  )
}
