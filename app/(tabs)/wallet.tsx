import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { WalletType } from '@/types';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Loading from '../components/Loading';
import ScreenWrapper from "../components/ScreenWrapper";
import WalletListItem from '../components/WalletListItem';

const Wallet = () => {
  const getTotalBalance = () => {
    const total = wallets.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);

    // Format thành tiền Việt Nam
    return total.toLocaleString("vi-VN", {
      currency: "VND",
    });
  };
  const { user } = useAuth();
  const router = useRouter();
  const { data: wallets, loading, error } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ])
  // console.log("wallets lenght", wallets.length);
  return (
    <ScreenWrapper className="flex-1 bg-neutral-950">
      {/* Balance View */}
      <View className="h-[20%] justify-center items-center">
        <Text className="text-white text-4xl">
          {getTotalBalance()} đ
        </Text>
        <Text className="text-neutral-300">
          Tổng số dư
        </Text>
      </View>
      <View className="absolute bottom-0 left-0 right-0 flex-1 bg-neutral-900  px-5 py-6 h-[80%]">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl font-medium">Ví của tôi</Text>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
              activeOpacity={0.7}
            >
              <Icons.PlusCircleIcon
                size={28}
                weight="fill" 
                color="#84cc16" />
          </TouchableOpacity>
        </View>
        {loading && <Loading />}
        <FlatList
          className='py-4'
          data={wallets}
          renderItem={({ item, index }) => {
            return (
              <WalletListItem item={item} index={index} router={router} />
            )
          }}
        />
      </View>      
    </ScreenWrapper>
  );
};

export default Wallet;
