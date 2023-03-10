import React from 'react'

import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack'

import notifee from '@notifee/react-native'

import { Home, NewUserList } from '../screens'
import { SendBirdProvider } from '@/context/sendbirdContext'
import { MMKVStorage } from '@/shared/utils/storage'

export type HomeStackParamList = {
  home: undefined
  newUserList: undefined
}

const options: StackNavigationOptions = {
  headerShown: true,
  ...TransitionPresets.SlideFromRightIOS,
}

const Stack = createStackNavigator<HomeStackParamList>()

export const onRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  // Set the channel for Android
  const channelId = await notifee.createChannel({
    id: 'SendbirdNotificationChannel',
    name: 'Sendbird RN Sample',
  })

  if (remoteMessage && remoteMessage.data) {
    let pushActionId = 'SendbirdNotification-'

    // Set the notification push action id from channel url
    const message = JSON.parse(remoteMessage.data.sendbird)
    let channelUrl = null
    if (message && message.channel) {
      channelUrl = message.channel.channel_url
    }
    pushActionId += channelUrl

    await MMKVStorage.setItem(pushActionId, JSON.stringify(remoteMessage))

    // Display a notification
    await notifee.displayNotification({
      title: 'Sendbird Sample',
      body: remoteMessage.data.message,
      android: {
        channelId,
        pressAction: {
          id: pushActionId,
          launchActivity: 'default',
        },
      },
    })
  }
}

export const HomeRoutes: React.FC = function () {
  // const savedUserKey = 'savedUser'
  //
  // useEffect(() => {
  //   // eslint-disable-next-line consistent-return
  //   ;(async () => {
  //     const user = MMKVStorage.getItem(savedUserKey)
  //
  //     console.log({ sendbird: sendbird?.currentUser })
  //     try {
  //       if (user) {
  //         const authorizationStatus = await messaging().requestPermission()
  //         if (
  //           authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //           authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  //         ) {
  //           if (Platform.OS === 'ios') {
  //             const token = await messaging().getAPNSToken()
  //             if (token != null) {
  //               sendbird.registerAPNSPushTokenForCurrentUser(token)
  //             }
  //           } else {
  //             const token = await messaging().getToken()
  //             sendbird.registerGCMPushTokenForCurrentUser(token)
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error(err)
  //     }
  //
  //     if (Platform.OS !== 'ios') {
  //       return messaging().onMessage(onRemoteMessage)
  //     }
  //   })()
  // }, [])

  return (
    <SendBirdProvider>
      <Stack.Navigator initialRouteName="home" screenOptions={options}>
        <Stack.Screen
          name="home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="newUserList"
          component={NewUserList}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SendBirdProvider>
  )
}
