import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
// eslint-disable-next-line import/no-extraneous-dependencies
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useTailwind } from 'tailwind-rn'

import { HomeLayout } from '../components/layout'
import { Box, Button, Space, TextInput } from '@/components/widgets'
import { useSendBird } from '@/context/sendbirdContext'
import { useAuthStore } from '@/modules/auth/stores'
import { useThemeStore } from '@/shared/stores'
import { navigate } from '@/shared/utils/navigation-utilities'

AntDesignIcon.loadFont().then()

export const Home: React.FC = function () {
  const isDarkMode = useThemeStore(state => state.isDarkMode)
  const logout = useAuthStore(state => state.logOutAction)
  const userInfo = useAuthStore(state => state.data)
  const { connect } = useSendBird()

  useEffect(() => {
    ;(async () => {
      if (userInfo?.user?.uid) {
        await connect(userInfo?.user?.uid)
      }
    })()
  }, [userInfo])

  // const showModal = useCallback(() => {
  //   showModalComponent(() => <ConfirmModal title="Alert" content="This is long text" />)
  // }, [])
  //
  // const emitEvent = useCallback(() => {
  //   EventRegister.emit(EVENTS.EVENT_LOGOUT)
  // }, [])

  const tailwind = useTailwind()

  const goToUserList = () => {
    navigate('newUserList')
  }

  return (
    <HomeLayout title="Home">
      <Space height={32} />
      <Box style={tailwind('flex-row')}>
        <TextInput
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          placeholder="Search..."
          style={tailwind('ml-2.5')}
        />
        <TouchableOpacity onPress={goToUserList}>
          <Box
            width={40}
            height={40}
            style={tailwind('ml-4 justify-center items-center rounded bg-sky-500')}>
            <AntDesignIcon name="plus" size={20} color="white" />
          </Box>
        </TouchableOpacity>
      </Box>
      <Button
        backgroundColor={!isDarkMode ? 'dark' : 'light'}
        onPress={logout}
        labelColor={isDarkMode ? 'dark' : 'light'}>
        Log out
      </Button>
    </HomeLayout>
  )
}
