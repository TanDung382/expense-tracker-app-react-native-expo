import { useAuth } from '@/contexts/authContext';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { WalletType } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import BackButton from '../components/BackButton';
import ImageUpload from '../components/ImageUpload';
import Loading from '../components/Loading';
import ModalWrapper from '../components/ModalWrapper';

const WalletModal = () => {
  const router = useRouter();
  const { user, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [wallet, setWallet] = useState<WalletType>({
    name: '',
    image: null,
  });

  const oldWallet: { name: string, image: string, id: string } = useLocalSearchParams();
  // console.log("old wallet", oldWallet);

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      })
    }
  }, [])

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert('Tên ví', 'Xin vui lòng nhập đầy đủ thông tin');
      return;
    }
    const data: WalletType = {
      name,
      image,
      uid: user?.uid
    }

    if (oldWallet?.id) data.id = oldWallet?.id;

    setIsLoading(true);
    const res = await createOrUpdateWallet(data);
    setIsLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert('Ví', res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setIsLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert('Ví', res.msg);
    }
  }

  const showDeteleAlert = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa? \nHành động này sẽ xóa tất cả giao dịch của ví này",
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
            {oldWallet?.id ? "Sửa ví" : "Tạo ví"}
          </Text>
        </View>

        <ScrollView className="px-5">
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Tên ví</Text>
            <TextInput
              placeholder="Nhập tên ví..."
              placeholderTextColor="#888"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
              className="bg-neutral-800 text-white rounded-lg px-4 py-3 border-white border border-t"
            />
          </View>   
          <View className="mb-5">
            <Text className="text-white mb-2 text-[16px]">Icon</Text>
            <ImageUpload
              file={wallet.image}
              onSelect={file => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              placeholder='Tải ảnh lên' />
          </View>   
        </ScrollView>
        <View className="p-5">
          {oldWallet?.id ? (
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

export default WalletModal;
