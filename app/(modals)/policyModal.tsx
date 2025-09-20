import React from 'react'
import { Text, View } from 'react-native'
import ModalWrapper from '../components/ModalWrapper'

const PolicyModal = () => {
  return (
    <ModalWrapper className="justify-end">
      <View className="h-[96%]">
        <Text className='text-white'>PolicyModal</Text>
      </View>
    </ModalWrapper>
  )
}

export default PolicyModal