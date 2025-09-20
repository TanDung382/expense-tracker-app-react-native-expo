import ScreenWrapper from '@/app/components/ScreenWrapper'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { useRouter } from 'expo-router'
import { limit, orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import HomeCard from '../components/HomeCard'
import TransactionList from '../components/TransactionList'

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()

  const contrains = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ]

  const {
    data: recentTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", contrains);
  
  return (
    <ScreenWrapper className="flex-1 bg-neutral-950 pt-2">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 px-5">
        <View className="gap-1">
          <Text className="text-neutral-400 text-base">Xin chào,</Text>
          <Text className="text-xl font-medium text-white">
            {user?.name}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-neutral-700 p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => router.push("/(modals)/searchModal")}
        >
          <Icons.MagnifyingGlassIcon
            size={22}
            color="#d4d4d8"
            weight="bold"
          />
        </TouchableOpacity>
      </View>

      {/* Scroll content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="px-5 mt-2 space-y-6"
      >
        {/* Card */}
        <View>
          <HomeCard />
        </View>

        <TransactionList
          data={recentTransactions}
          loading={transactionLoading}
          emptyListMessage="Chưa có giao dịch nào"
          title="Giao dịch gần đây" />
      </ScrollView>
      <TouchableOpacity
        onPress={() => router.push('/(modals)/transactionModal')}
        className="absolute bottom-7 right-7 w-12 h-12 rounded-full bg-lime-400 justify-center items-center shadow-lg"
      >
        <Icons.PlusIcon
          color="black"
          weight="bold"
          size={24}
        />
      </TouchableOpacity>

    </ScreenWrapper>
  )
}

export default Home
