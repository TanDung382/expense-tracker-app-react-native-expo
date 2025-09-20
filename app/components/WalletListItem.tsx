import { WalletType } from '@/types'
import { Image } from 'expo-image'
import { Router } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const WalletListItem = ({
  item,
  index,
  router
}: {
    item: WalletType,
    index: number,
    router: Router,
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image
      }
    })
  }
  return (
    <Animated.View
      entering={FadeInDown.delay(index*50)}      
    >
      <TouchableOpacity
        onPress={openWallet}
        className="flex-row items-center mb-4"
      >
        <View className="h-11 w-11 border border-neutral-600 rounded-lg overflow-hidden">
          <Image
            source={item?.image}
            contentFit="cover"
            transition={100}
            style={{ width: '100%', height: '100%'}}
          />
        </View>

        <View className="flex-1 ml-2 gap-1">
          <Text className="text-base font-medium text-white">{item?.name}</Text>
          <Text className="text-sm text-neutral-400">
            {item?.amount?.toLocaleString("vi-VN") + " ₫"}
          </Text>
        </View>

        <Icons.CaretRightIcon size={20} weight="bold" color="white" />

      </TouchableOpacity>
    </Animated.View>
  )
}

export default WalletListItem