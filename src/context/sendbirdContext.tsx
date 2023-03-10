import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import SendBird from 'sendbird'

const SendBirdContext = createContext<any>({})

const appId = '85C469EF-7E2E-4C9C-8A8B-8C5D419539A5'
const apiToken = '2d4944cae1506cfeefd5b3ced4c718bfc4b7f73b'
const sendbird = new SendBird({ appId })

const initialState = {
  sendbird,
}

function useSendBirdValue() {
  const [userId, setUserId] = useState<SendBird.User['userId']>()
  const [userInfo, setUserInfo] = useState<SendBird.User>()

  const sbRef = useRef<SendBird.SendBirdInstance>()
  const channelHandler = useRef<any>(null)
  const userEventHandler = useRef<any>(null)
  const connectionHandler = useRef<any>(null)

  const callHandler = useRef<any>({})

  useEffect(() => {
    if (!sbRef?.current) {
      sbRef.current = initialState.sendbird as SendBird.SendBirdInstance
    }
  }, [initialState.sendbird])

  function updateCurrentUserInfo(NICKNAME: string, PROFILE_URL?: string) {
    return new Promise((resolve, reject) => {
      sbRef.current?.updateCurrentUserInfo(NICKNAME, PROFILE_URL ?? '', (response, error) => {
        if (error) reject(error)
        resolve(response)
      })
    })
  }

  const connectWrapper = useCallback((USER_ID: string, NICK_NAME: string) => {
    return new Promise((resolve, reject) => {
      sbRef.current?.connect(USER_ID, async (user, error) => {
        if (error) reject(error)
        console.log('connect', user)
        await updateCurrentUserInfo(NICK_NAME)
        resolve(user)
      })
    })
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function connect(USER_ID: string, NICK_NAME: string) {
    return new Promise((resolve, reject) => {
      sbRef.current?.connect(USER_ID, apiToken, async (user, error) => {
        if (error) reject(error)
        setUserId(USER_ID)
        if (NICK_NAME) {
          const newUser = await updateCurrentUserInfo(NICK_NAME)
          if (newUser) {
            setUserInfo(newUser as SendBird.User)
          }
          resolve(newUser)
        }
        if (user) {
          setUserInfo(user)
        }
        setUserInfo(user)
        resolve(user)
      })
    })
  }

  function disconnect() {
    return new Promise(resolve => {
      sbRef.current?.disconnect(() => {
        // console.log('disconnect')
        // A current user is discconected from Sendbird server.
        resolve(true)
      })
    })
  }

  function onMessageReceived() {
    return new Promise(resolve => {
      channelHandler.current.onMessageReceived = (channel: string, message: string) => {
        console.log('onMessageReceived')
        resolve({ channel, message })
      }
    })
  }

  function onMessageUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onMessageUpdated = (channel: string, message: string) => {
        console.log('onMessageUpdated')
        resolve({ channel, message })
      }
    })
  }

  function onMessageDeleted() {
    return new Promise(resolve => {
      channelHandler.current.onMessageDeleted = (channel: string, message: string) => {
        console.log('onMessageDeleted')
        resolve({ channel, message })
      }
    })
  }

  function onMentionReceived() {
    return new Promise(resolve => {
      channelHandler.current.onMentionReceived = (channel: string, message: string) => {
        console.log('onMentionReceived')
        resolve({ channel, message })
      }
    })
  }

  function onChannelChanged() {
    return new Promise(resolve => {
      channelHandler.current.onChannelChanged = (channel: string) => {
        console.log('onChannelChanged')
        resolve({ channel })
      }
    })
  }

  function onChannelDeleted() {
    return new Promise(resolve => {
      channelHandler.current.onChannelDeleted = (channelUrl: string, channelType: string) => {
        console.log('onChannelDeleted')
        resolve({ channelUrl, channelType })
      }
    })
  }

  function onChannelFrozen() {
    return new Promise(resolve => {
      channelHandler.current.onChannelFrozen = (channel: string) => {
        console.log('onChannelFrozen')
        resolve({ channel })
      }
    })
  }

  function onChannelUnfrozen() {
    return new Promise(resolve => {
      channelHandler.current.onChannelUnfrozen = (channel: string) => {
        resolve({ channel })
      }
    })
  }

  function onMetaDataCreated() {
    return new Promise(resolve => {
      channelHandler.current.onMetaDataCreated = (channel: string, metaData: string) => {
        resolve({ channel, metaData })
      }
    })
  }

  function onMetaDataUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onMetaDataUpdated = (channel: string, metaData: string) => {
        resolve({ channel, metaData })
      }
    })
  }

  function onMetaDataDeleted() {
    return new Promise(resolve => {
      channelHandler.current.onMetaDataDeleted = (channel: string, metaDataKeys: string) => {
        resolve({ channel, metaDataKeys })
      }
    })
  }

  function onMetaCountersCreated() {
    return new Promise(resolve => {
      channelHandler.current.onMetaCountersCreated = (channel: string, metaCounter: string) => {
        resolve({ channel, metaCounter })
      }
    })
  }

  function onMetaCountersUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onMetaCountersUpdated = (channel: string, metaCounter: string) => {
        resolve({ channel, metaCounter })
      }
    })
  }

  function onMetaCountersDeleted() {
    return new Promise(resolve => {
      channelHandler.current.onMetaCountersDeleted = (channel: string, metaCounterKeys: string) => {
        console.log('onMetaCountersDeleted')
        resolve({ channel, metaCounterKeys })
      }
    })
  }

  function onChannelHidden() {
    return new Promise(resolve => {
      channelHandler.current.onChannelHidden = (groupChannel: string) => {
        resolve({ groupChannel })
      }
    })
  }

  function onUserReceivedInvitation() {
    return new Promise(resolve => {
      channelHandler.current.onUserReceivedInvitation = (
        groupChannel: string,
        inviter: string,
        invitees: string,
      ) => {
        resolve({ groupChannel, inviter, invitees })
      }
    })
  }

  function onUserDeclinedInvitation() {
    return new Promise(resolve => {
      channelHandler.current.onUserDeclinedInvitation = (
        groupChannel: string,
        inviter: string,
        invitee: string,
      ) => {
        resolve({ groupChannel, inviter, invitee })
      }
    })
  }

  function onUserJoined() {
    return new Promise(resolve => {
      channelHandler.current.onUserJoined = (groupChannel: string, user: string) => {
        resolve({ groupChannel, user })
      }
    })
  }

  function onUserLeft() {
    return new Promise(resolve => {
      channelHandler.current.onUserLeft = (groupChannel: string, user: string) => {
        resolve({ groupChannel, user })
      }
    })
  }

  function onDeliveryReceiptUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onDeliveryReceiptUpdated = (groupChannel: string) => {
        console.log('onDeliveryReceiptUpdated')
        resolve({ groupChannel })
      }
    })
  }

  function onReadReceiptUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onReadReceiptUpdated = (groupChannel: string) => {
        console.log('onReadReceiptUpdated')
        resolve({ groupChannel })
      }
    })
  }

  function onTypingStatusUpdated() {
    return new Promise(resolve => {
      channelHandler.current.onTypingStatusUpdated = (groupChannel: string) => {
        console.log('onTypingStatusUpdated')
        resolve({ groupChannel })
      }
    })
  }

  function onUserEntered() {
    return new Promise(resolve => {
      channelHandler.current.onUserEntered = (openChannel: string, user: string) => {
        console.log('onUserEntered')
        resolve({ openChannel, user })
      }
    })
  }

  function onUserExited() {
    return new Promise(resolve => {
      channelHandler.current.onUserExited = (openChannel: string, user: string) => {
        console.log('onUserExited')
        resolve({ openChannel, user })
      }
    })
  }

  function onUserMuted() {
    return new Promise(resolve => {
      channelHandler.current.onUserMuted = (channel: string, user: string) => {
        console.log('onUserMuted')
        resolve({ channel, user })
      }
    })
  }

  function onUserUnmuted() {
    return new Promise(resolve => {
      channelHandler.current.onUserUnmuted = (channel: string, user: string) => {
        console.log('onUserUnmuted')
        resolve({ channel, user })
      }
    })
  }

  function onUserBanned() {
    return new Promise(resolve => {
      channelHandler.current.onUserBanned = (channel: string, user: string) => {
        console.log('onUserBanned')
        resolve({ channel, user })
      }
    })
  }

  function onUserUnbanned() {
    return new Promise(resolve => {
      channelHandler.current.onUserUnbanned = (channel: string, user: string) => {
        console.log('onUserUnbanned')
        resolve({ channel, user })
      }
    })
  }

  function onFriendsDiscovered() {
    return new Promise((resolve: unknown) => {
      userEventHandler.current.onFriendsDiscovered = (users: unknown) => {
        if (resolve && typeof resolve === 'function') {
          resolve({ users })
        }
      }
    })
  }

  function onTotalUnreadMessageCountUpdated() {
    return new Promise(resolve => {
      userEventHandler.current.onTotalUnreadMessageCountUpdated = (
        totalCount: any,
        countByCustomTypes: any,
      ) => {
        resolve({ totalCount, countByCustomTypes })
      }
    })
  }

  function onReconnectStarted() {
    return new Promise((resolve: unknown) => {
      connectionHandler.current.onReconnectStarted = () => {
        if (resolve && typeof resolve === 'function') {
          resolve()
        }
      }
    })
  }

  function onReconnectSucceeded() {
    return new Promise((resolve: unknown) => {
      connectionHandler.current.onReconnectSucceeded = () => {
        if (resolve && typeof resolve === 'function') {
          resolve()
        }
      }
    })
  }

  function onReconnectFailed() {
    return new Promise((resolve: unknown) => {
      connectionHandler.current.onReconnectFailed = () => {
        if (resolve && typeof resolve === 'function') {
          resolve()
        }
      }
    })
  }

  function updateCurrentUserInfoWithProfileImage(NICKNAME: string, PROFILE_FILE: string) {
    return new Promise((resolve, reject) => {
      sbRef.current?.updateCurrentUserInfoWithProfileImage(
        NICKNAME,
        PROFILE_FILE,
        (response, error) => {
          if (error) reject(error)
          resolve(resolve)
        },
      )
    })
  }

  function inviteWithUserIds(groupChannel: any, userIds = []) {
    return new Promise((resolve, reject) => {
      groupChannel?.inviteWithUserIds?.(userIds, (response: () => void, error: Error) => {
        if (error) {
          reject(error)
        }

        resolve(response)
      })
    })
  }

  function joinChannel(groupChannel: any) {
    return new Promise((resolve, reject) => {
      groupChannel?.join((response: () => void, error: Error) => {
        if (error) reject(error)

        resolve(true)
      })
    })
  }

  function leave(groupChannel: any) {
    return new Promise((resolve, reject) => {
      groupChannel.leave((response: () => void, error: Error) => {
        if (error) reject(error)

        resolve(true)
      })
    })
  }

  function deleteChannel(groupChannel: any) {
    return new Promise((resolve, reject) => {
      groupChannel.delete((response: () => void, error: Error) => {
        if (error) reject(error)

        resolve(response)
      })
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function createChannelWithUserIds(
    userIds: any[],
    distinct: boolean,
    NAME: string,
    COVER_IMAGE_OR_URL: string,
    DATA: any,
  ) {
    return new Promise((resolve, reject) => {
      // When 'distinct' is false
      sbRef.current?.GroupChannel.createChannelWithUserIds(
        userIds.concat(userId as any),
        distinct,
        NAME,
        COVER_IMAGE_OR_URL,
        DATA,
        (groupChannel, error) => {
          if (error) reject(error)

          console.log('createChannelWithUserIds', groupChannel)

          resolve(groupChannel)
        },
      )
    })
  }

  function channelListQuery() {
    return new Promise((resolve, reject) => {
      if (sbRef.current) {
        // eslint-disable-next-line no-underscore-dangle
        const _channelListQuery: any = sbRef.current?.GroupChannel.createMyGroupChannelListQuery()
        _channelListQuery.includeEmpty = true
        _channelListQuery.order = 'latest_last_message' // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
        _channelListQuery.limit = 15 // The value of pagination limit could be set up to 100.

        if (_channelListQuery.hasNext) {
          _channelListQuery.next((channelList: any, error: Error) => {
            if (error) reject(error)
            // console.log('channelList -->', channelList)
            resolve(channelList)
          })
        }
      }
    })
  }

  function getChannel(CHANNEL_URL: string) {
    return new Promise((resolve, reject) => {
      sbRef.current?.GroupChannel.getChannel(CHANNEL_URL, (groupChannel, error) => {
        if (error) reject(error)

        resolve(groupChannel)
      })
    })
  }

  function sendFileMessage(
    groupChannel: any,
    FILE: any,
    FILE_NAME: any,
    FILE_SIZE: any,
    MIME_TYPE: any,
  ) {
    return new Promise((resolve, reject) => {
      // const params = new sbRef.current()?.FileMessageParams()
      const params: any = {}

      params.file = FILE // Or .fileUrl = FILE_URL (You can also send a file message with a file URL.)
      params.fileName = FILE_NAME
      params.fileSize = FILE_SIZE
      params.thumbnailSizes = [
        { maxWidth: 100, maxHeight: 100 },
        { maxWidth: 200, maxHeight: 200 },
      ] // Add the maximum sizes of thumbnail images (allowed number of thumbnail images: 3).
      params.mimeType = MIME_TYPE
      // params.customType = CUSTOM_TYPE
      // params.data = DATA
      // params.mentionType = 'users' // Either 'users' or 'channel'
      // params.mentionedUserIds = ['Jeff', 'Julia'] // Or mentionedUsers = Array<User>;
      // params.metaArrayKeys = ['linkTo', 'itemType']
      // params.translationTargetLanguages = ['fe', 'de'] // French and German
      // params.pushNotificationDeliveryOption = 'default' // Either 'default' or 'suppress'

      groupChannel.sendFileMessage(params, (fileMessage: any, error: any) => {
        if (error) reject(error)

        // var thumbnailFirst = fileMessage.thumbnails[0]
        // var thumbnailSecond = fileMessage.thumbnails[1]

        // var maxHeightFirst = thumbnailFirst.maxHeight // 100
        // var maxHeightSecond = thumbnailSecond.maxHeight // 200

        // var urlFirst = thumbnailFirst.url // The URL of first thumbnail file.
        // var urlSecond = thumbnailSecond.url // The URL of second thumbnail file

        resolve(fileMessage)
      })
    })
  }

  function createPreviousMessageListQuery(groupChannel: any, LIMIT = 10, REVERSE = false) {
    return new Promise(resolve => {
      if (!groupChannel) {
        console.log('Channel not init!!!')
        return
      }

      const prevMessageListQuery = groupChannel.createPreviousMessageListQuery()
      prevMessageListQuery.limit = LIMIT
      prevMessageListQuery.reverse = REVERSE
      prevMessageListQuery.includeMetaArray = true // Retrieve a list of messages along with their metaarrays.
      prevMessageListQuery.includeReaction = true // Retrieve a list of messages along with their reactions.

      resolve(prevMessageListQuery)
    })
  }

  function refresh(groupChannel: any) {
    return new Promise((resolve, reject) => {
      groupChannel.refresh((response: () => void, error: Error) => {
        if (error) reject(error)

        resolve(response)
      })
    })
  }

  function markAsDelivered(CHANNEL_URL: string) {
    sbRef.current?.markAsDelivered(CHANNEL_URL)
  }

  /**
   * Call
   */
  function onRinging() {
    return new Promise(resolve => {
      callHandler.current.onRinging = (call: any) => {
        // console.log('onRinging')
        resolve({ call })
      }
    })
  }

  function onAudioInputDeviceChanged() {
    return new Promise(resolve => {
      callHandler.current.onAudioInputDeviceChanged = (call: any) => {
        // console.log('onAudioInputDeviceChanged')
        resolve({ call })
      }
    })
  }

  function onAudioOutputDeviceChanged() {
    return new Promise(resolve => {
      callHandler.current.onAudioOutputDeviceChanged = (call: any) => {
        // console.log('onAudioOutputDeviceChanged')
        resolve({ call })
      }
    })
  }

  function onVideoInputDeviceChanged() {
    return new Promise(resolve => {
      callHandler.current.onVideoInputDeviceChanged = (call: any) => {
        // console.log('onVideoInputDeviceChanged')
        resolve({ call })
      }
    })
  }

  function dispose(mediaAccess: any) {
    mediaAccess?.dispose?.()
  }

  return {
    userInfo,
    userId,
    sendbird: sbRef?.current,
    connect,
    disconnect,

    onMessageReceived,
    onMessageUpdated,
    onMessageDeleted,

    onMentionReceived,
    onChannelChanged,
    onChannelDeleted,
    onChannelFrozen,
    onChannelUnfrozen,

    onMetaDataCreated,
    onMetaDataUpdated,
    onMetaDataDeleted,
    onMetaCountersCreated,
    onMetaCountersUpdated,
    onMetaCountersDeleted,

    onChannelHidden,
    onUserReceivedInvitation,
    onUserDeclinedInvitation,

    onUserJoined,
    onUserLeft,
    onDeliveryReceiptUpdated,
    onReadReceiptUpdated,
    onTypingStatusUpdated,

    onUserEntered,
    onUserExited,
    onUserMuted,
    onUserUnmuted,
    onUserBanned,
    onUserUnbanned,

    onFriendsDiscovered,
    onTotalUnreadMessageCountUpdated,

    onReconnectStarted,
    onReconnectSucceeded,
    onReconnectFailed,

    //  chat
    updateCurrentUserInfo,
    updateCurrentUserInfoWithProfileImage,
    inviteWithUserIds,
    joinChannel,
    leave,
    deleteChannel,

    createChannelWithUserIds,
    channelListQuery,
    getChannel,
    sendFileMessage,
    createPreviousMessageListQuery,
    refresh,
    markAsDelivered,

    // call
    onRinging,
    onAudioInputDeviceChanged,
    onAudioOutputDeviceChanged,
    onVideoInputDeviceChanged,

    dispose,
  }
}

export function SendBirdProvider({ children }: any) {
  return <SendBirdContext.Provider value={useSendBirdValue()}>{children}</SendBirdContext.Provider>
}

export const useSendBird = () => useContext(SendBirdContext)
