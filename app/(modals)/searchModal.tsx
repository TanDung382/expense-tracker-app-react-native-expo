import { expenseCategories } from "@/constants/data";
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import ModalWrapper from '../components/ModalWrapper';
import TransactionList from '../components/TransactionList';

const SearchModal = () => {
  const router = useRouter();
  const { user, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const contrains = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
  ]

  const {
    data: allTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", contrains);

  const filteredTransactions = allTransactions.filter((item) => {
  if (search.length > 1) {
    const lowerSearch = search.toLowerCase();
    if (
      item.category?.toLowerCase()?.includes(lowerSearch) || // match value (en)
      expenseCategories[item.category as keyof typeof expenseCategories]?.label
        ?.toLowerCase()
        ?.includes(lowerSearch) || // match label (vi)
      item.type?.toLowerCase()?.includes(lowerSearch) ||
      item.description?.toLowerCase()?.includes(lowerSearch)
    ) {
      return true;
    }
    return false;
  }
  return true;
});
  
  return (
    <ModalWrapper className="justify-end">
      {isLoading && <Loading />}
      <View className="h-[96%] rounded-t-3xl">
        <View className="p-5 items-center">
          <BackButton className="absolute left-5" />
          <Text className="text-2xl font-bold text-white text-center">
            Tìm kiếm
          </Text>
        </View>

        <ScrollView className="px-5">
          <View className="mb-5">
            <TextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="#888"
              value={search}
              onChangeText={(value) => setSearch(value)}
              className="bg-neutral-800 text-white rounded-lg px-4 py-3 border-white border border-t"
            />
          </View>   
          <View>
            <TransactionList
              data={filteredTransactions}
              loading={transactionLoading}
              emptyListMessage="Không tìm thấy giao dịch"
            />
          </View>
        </ScrollView>        
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;
