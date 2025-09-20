import { auth } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage, uploadFileToCloudinary } from '@/services/imageService';
import { updateUser } from '@/services/userService';
import { UserDataType } from '@/types';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import ModalWrapper from '../components/ModalWrapper';

const ProfileModal = () => {
  const router = useRouter();
  const { user, updateUserData } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.dismissAll();
    router.replace("/(auth)/welcome");
    
  };

  const handleSaveName = async () => {
    let { name } = userData;
    if (!name.trim()) {
      Alert.alert("Tên", "Xin vui lòng nhập tên");
      return;
    }
    setIsSavingName(true);
    const res = await updateUser(user?.uid as string, userData);
    setIsSavingName(false);
    if (res.success) {
      updateUserData(user?.uid as string)
      setIsEditingName(false);
    } else {
      Alert.alert("Người dùng", res.msg)
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      setIsUploading(true);
      // upload ảnh lên Cloudinary
      const uploadRes = await uploadFileToCloudinary(pickedImage, "users");

      if (uploadRes.success) {
        const res = await updateUser(user?.uid as string, {
          ...userData,
          image: uploadRes.data, 
        });
        if (res.success) {
          updateUserData(user?.uid as string);
        } else {
          Alert.alert("Upload ảnh", res.msg || "Có lỗi xảy ra");
        }
      } else {
        Alert.alert("Upload ảnh", uploadRes.msg || "Có lỗi xảy ra");
      }
      setIsUploading(false);
    }
  }

  return (
    <ModalWrapper className="justify-end">  
      {isUploading && <Loading />}  
      <View className="h-[96%]">
        <View className="p-5 items-center gap-4">
          <BackButton className="left-5" />
          <Text className="text-2xl font-bold text-white text-center mb-6">
            Hồ sơ
          </Text>
        </View>

        <View className="items-center">
          {/* Avatar */}
          <View className="w-[135px] h-[135px] rounded-full bg-neutral-300 relative">
            <Image
              source={getProfileImage(userData.image)}
              style={{ width: 135, height: 135, borderRadius: 67 }}
              contentFit="cover"
              transition={100}
            />
            <TouchableOpacity
              className="absolute bottom-2 right-3 bg-neutral-200 rounded-full p-2 shadow-md elevation-4"
              activeOpacity={0.7}
              onPress={onPickImage}
            >
              <Icons.PencilIcon size={20} />
            </TouchableOpacity>
          </View>

          <View className="items-center mt-4 w-full">
            <View className="w-full px-5 py-3 bg-neutral-800 flex-row items-center 
              border-b border-neutral-700 justify-between"> 
              <Text className="text-white text-base">Email</Text>
              <Text className="text-white">{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsEditingName(true);
              }}
              className="w-full px-5 py-3 bg-neutral-800"
            >
              <View className="flex-row items-center justify-between w-full">
                <Text className="text-white text-base">Tên</Text>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-lg font-semibold text-white">
                    {user?.name}
                  </Text>
                  <Icons.CaretRightIcon size={17} color="white" weight="bold" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="w-full bg-neutral-800 py-3 px-6 mt-4 rounded-lg"
          >
            <Text className="text-white text-center text-lg">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal edit name */}
      <Modal
        visible={isEditingName}
        animationType="fade"
        transparent
        onRequestClose={() => setIsEditingName(false)}
      >
        {isSavingName && <Loading />}
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-[#181818] p-5 rounded-2xl">
            <Text className="text-white text-center text-xl font-bold mb-7">Tên</Text>
            <TextInput
              value={userData.name} 
              onChangeText={(value) => setUserData({...userData, name: value})}
              className="border border-gray-300 bg-[#303030] text-white rounded py-5"
              autoFocus
            />

            <View className="flex-row justify-between space-x-3 pt-5">
              <TouchableOpacity
                onPress={() => setIsEditingName(false)}
                className="w-[45%] py-5 bg-lime-500 rounded-xl items-center"
              >
                <Icons.XIcon size={17} color="white" weight="bold" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveName}
                className="w-[45%] py-5 bg-lime-500 rounded-xl items-center"
              >
                <Icons.CheckIcon size={17} color="white" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ModalWrapper>
  );
};

export default ProfileModal;
