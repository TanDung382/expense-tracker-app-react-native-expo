import { expenseCategories, transactionTypes } from '@/constants/data';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import BackButton from '../components/BackButton';
import ImageUpload from '../components/ImageUpload';
import Loading from '../components/Loading';
import ModalWrapper from '../components/ModalWrapper';

const TransactionModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    category: "",
    date: new Date(),
    description: "",
    image: null,
    walletId: "",
  });

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();
  // console.log("oldTransaction", oldTransaction);

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        description: oldTransaction.description || "",
        image: oldTransaction?.image,
        walletId: oldTransaction.walletId,
      })
    }
  }, [])

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || transaction.date; // fallback về date cũ
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(false);
  };

  
  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || !amount || (type == 'expense' && !category)) {
      Alert.alert("Giao dịch", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image? image : null,
      uid: user?.uid
    }

    if (oldTransaction?.id) transactionData.id = oldTransaction.id;

    setIsLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setIsLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Giao dịch", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setIsLoading(true);
    const res = await deleteTransaction(oldTransaction?.id, oldTransaction.walletId);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert('Giao dịch', res.msg);
    }
  };

  const showDeteleAlert = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa giao dịch này?",
      [
        {
          text: "Hủy",
          style: 'cancel',
        },
        {
          text: "Xóa",
          style: 'destructive',
          onPress: onDelete,
        }
      ]
    )
  };

  return (
    <ModalWrapper className="justify-end">
      {isLoading && <Loading />}
      <View className="h-[96%] rounded-t-3xl">
        <View className="p-5 items-center">
          <BackButton className="absolute left-5" />
          <Text className="text-2xl font-bold text-white text-center">
            {oldTransaction?.id ? "Sửa giao dịch" : "Tạo giao dịch"}
          </Text>
        </View>

        <ScrollView className="px-5">
          {/* loại */}
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Loại</Text>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor="#404040"
              // placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              // placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={((item) => {
                setTransaction({...transaction, type: item.value})
              })}
            />
          </View>  
          {/* ví input */}
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Ví</Text>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor="#404040"
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map(wallet => ({
                label: `${wallet.name} (${wallet.amount}đ)`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={"Chọn ví"}
              value={transaction.walletId}
              onChange={((item) => {
                setTransaction({...transaction, walletId: item.value || ""})
              })}
            />
          </View>
          {/* expense */}
          {transaction.type == "expense" && (
            <View className="mb-5">
              <Text className="text-white mb-2 text-[16px]">Loại chi phí</Text>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor="#404040"
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={"Chọn loại chi phí"}
                value={transaction.category}
                onChange={((item) => {
                  setTransaction({...transaction, category: item.value || ""})
                })}
              />
            </View>
          )}
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Ngày</Text>
            {
              !showDatePicker && (
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row h-[54px] items-center border border-[#D4D4D4] rounded-2xl px-[15px]"
                >
                  <Text className="text-white">
                    {(transaction.date as Date).toLocaleDateString()}
                  </Text>
                </Pressable>
              )
            }
            {
              showDatePicker && (
                <View>
                  <DateTimePicker
                    value={transaction.date as Date}
                    mode='date'
                    display='calendar'
                    onChange={onDateChange}
                  />
                </View>
              )
            }
          </View>  
          
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Số tiền</Text>
            <TextInput
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) => setTransaction({
                ...transaction, 
                amount: Number(value.replace(/[^0-9]/g, ""))
              })}
              className="bg-neutral-800 text-white rounded-lg px-4 py-3 border-white border border-t"
            />
          </View>  

          <View className="mb-5">
            <View className="flex-row item ">
              <Text className="text-white mb-2 text-[16px]">Mô tả</Text>
              <Text className="text-neutral-500 px-1">(Lựa chọn)</Text>
            </View>            
            <TextInput
              multiline
              value={transaction.description}
              onChangeText={(value) => setTransaction({
                ...transaction, description: value
              })}
              className="bg-neutral-800 text-white rounded-lg px-4 py-3 
              border-white border border-t flex-row items-start h-[100px]"
            />
          </View>  

          <View className="mb-5">
            <Text className="text-white mb-2">Biên lai</Text>
            <ImageUpload
              file={transaction.image}
              onSelect={file => setTransaction({ ...transaction, image: file })}
              onClear={() => setTransaction({ ...transaction, image: null })}
              placeholder='Tải ảnh lên' />
          </View>   
        </ScrollView>
        <View className="p-5">
          {oldTransaction?.id ? (
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={onSubmit}
                className="bg-lime-500 py-3 rounded-xl flex-1"
              >
                <Text className="text-neutral-900 text-center font-semibold text-lg">
                  Cập nhật
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showDeteleAlert}
                className="bg-red-500 w-14 h-14 rounded-xl items-center justify-center ml-3"
              >
                <Icons.TrashIcon size={24} weight="bold" color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onSubmit}
              className="bg-lime-500 py-3 rounded-xl"
            >
              <Text className="text-neutral-900 text-center font-semibold text-lg">
                Thêm
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  dropdownItemText: { 
    color: "#FFFFFF", // trắng
  },
  dropdownSelectedText: {
    color: "#FFFFFF", 
    fontSize: 14, // thay verticalScale(14)
  },
  dropdownListContainer: {
    backgroundColor: "#171717", // neutral900
    borderRadius: 15,
    borderCurve: "continuous",
    paddingVertical: 7,
    top: 5,
    borderColor: "#737373", // neutral500
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: "#FFFFFF",
  },
  dropdownItemContainer: {
    borderRadius: 15,
    marginHorizontal: 7,
  },
  dropdownIcon: {
    height: 30,
    tintColor: "#D4D4D4", // neutral300
  },
  iosDatePicker: {
    // ví dụ: backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: "#404040", // neutral700
    alignSelf: "flex-end",
    padding: 7,
    marginRight: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  dropdownContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: "#D4D4D4", // neutral300
    paddingHorizontal: 15,
    borderRadius: 15,
    borderCurve: "continuous",
  },
})