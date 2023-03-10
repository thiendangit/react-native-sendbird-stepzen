import React, { useEffect, useState } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native'
// eslint-disable-next-line import/no-extraneous-dependencies
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { ApplicationUserListQuery, User } from 'sendbird'
import { useTailwind } from 'tailwind-rn'

import { HomeLayout } from '../components/layout'
import { Box, Image, Text } from '@/components/widgets'
import { useSendBird } from '@/context/sendbirdContext'

AntDesignIcon.loadFont().then()

export const NewUserList: React.FC = function () {
  const { sendbird, userInfo: sendBirdUserInfo } = useSendBird()
  const [users, setUsers] = useState<User[]>()

  useEffect(() => {
    ;(async () => {
      if (sendbird) {
        const queryParams: Partial<ApplicationUserListQuery> = {
          limit: 20,
        }
        const query = sendbird.createApplicationUserListQuery(queryParams)

        const result = await query.next()
        setUsers(result)
      }
    })()
  }, [sendBirdUserInfo])

  const onPressOpenChannel = () => {
    //
  }

  const tailwind = useTailwind()

  const renderItem: ListRenderItem<User> = ({ item }) => {
    return (
      <View>
        <View style={[tailwind('flex-row items-center justify-between mt-6')]}>
          <Image
            style={[
              {
                height: 55,
                width: 55,
                overflow: 'hidden',
              },
              tailwind('rounded-full border-4 border-[#7A8194]'),
            ]}
            resizeMode="center"
            source={{
              uri: 'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau.jpg',
            }}
          />
          <Text style={tailwind('ml-4 text-lg')}>{item?.nickname}</Text>
        </View>
        <View style={tailwind('mt-6 text-right')}>
          <TouchableOpacity onPress={onPressOpenChannel}>
            <Box
              width={40}
              height={40}
              style={tailwind('self-end ml-4 justify-center items-center rounded-lg bg-sky-500')}>
              <AntDesignIcon name="plus" size={20} color="white" />
            </Box>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <HomeLayout title="Home">
      <FlatList
        data={users}
        extraData={users}
        renderItem={renderItem}
        // style={tailwind('w-[90%] flex')}
      />
    </HomeLayout>
  )
}
