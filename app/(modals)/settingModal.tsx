import { auth } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenWrapper from '../components/ScreenWrapper';

const SettingModal = () => {
  const router = useRouter();
  const { user }  = useAuth();
  const accountOptions: accountOptionType[] = [
    {
      title: "Sửa hồ sơ",
      icon: (
        <Icons.UserIcon 
          size={26}
          weight='fill'
          color="white"
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "#6366f1"
    },
    {
      title: "Cài đặt",
      icon: (
        <Icons.GearSixIcon 
          size={26}
          weight='fill'
          color="white"
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "#059669"
    },
    {
      title: "Chính sách bảo mật",
      icon: (
        <Icons.LockIcon 
          size={26}
          weight='fill'
          color="white"
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "#525252"
    },
    {
      title: "Đăng xuất",
      icon: (
        <Icons.PowerIcon 
          size={26}
          weight='fill'
          color="white"
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "#e11d48"
    }
  ]

  const handleLogout = async () => {
    await signOut(auth);
  }

  const showLogOutAlert = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        onPress: () => console.log("Hủy"),
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => handleLogout(),
        style: "destructive",
      }
    ])
  }

  const handlePress = async (item: accountOptionType) => {
    if (item.title == 'Đăng xuất') {
      showLogOutAlert();
    }
  }

  return (
    <ScreenWrapper className=" flex-1">
      <View className='gap-4 px-4'>
        <View className="flex-row items-center gap-4 mt-4">
          <View className="w-14 h-14 rounded-full bg-neutral-500 overflow-hidden items-center justify-center">
            <Image
              source={getProfileImage(user?.image)}
              style={{ width: 56, height: 56, borderRadius: 67 }}
              contentFit="cover"
              transition={100}
            />
          </View>
          {!user ? (
            <TouchableOpacity
              className="flex-1"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-white font-bold text-base">
                Đăng nhập
              </Text>
              <Text className="text-slate-400 font-bold text-base">
                Đăng nhập, thú vị hơn!
              </Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                className="flex-1"
                onPress={() => router.push('/(modals)/profileModal')}
              >
              <Text className="text-white font-bold text-base">
                {user.name}
              </Text>
              <Text className="text-slate-400 text-sm">
                Email: {user.email}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View className="flex-col gap-4 mt-6">
          {
            accountOptions.map((item, index) => {
              return (
                <Animated.View
                  key={index.toString()}
                  entering={FadeInDown.delay(index * 50).duration(600)}
                >
                  <TouchableOpacity onPress={() => handlePress(item)}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-x-3">
                        <View
                          style={{ backgroundColor: item.bgColor }}
                          className="w-11 h-11 items-center justify-center rounded-xl"
                        >
                          {item.icon}
                        </View>
                        <Text className="text-white text-lg">{item.title}</Text>                      
                      </View>
                      <Icons.CaretRightIcon
                          size={17}
                        color='white'
                        weight='bold'
                        />
                    </View>                  
                  </TouchableOpacity>
                </Animated.View>
              )
            })
          }
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default SettingModal