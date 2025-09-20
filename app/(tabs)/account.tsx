import { auth } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenWrapper from '../components/ScreenWrapper';

const Account = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const optionLabels: Record<string, string> = {
    editProfile: "Sửa hồ sơ",
    setting: "Cài đặt",
    privacyPolicy: "Chính sách bảo mật",
    logout: "Đăng xuất",
  };

  const accountOptions: accountOptionType[] = [
    {
      title: "editProfile",
      icon: <Icons.UserIcon size={26} weight="fill" color="white" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "setting",
      icon: <Icons.GearSixIcon size={26} weight="fill" color="white" />,
      routeName: "/(modals)/settingModal",
      bgColor: "#059669",
    },
    {
      title: "privacyPolicy",
      icon: <Icons.LockIcon size={26} weight="fill" color="white" />,
      routeName: "/(modals)/policyModal",
      bgColor: "#525252",
    },   
  ]

  const handleLogout = async () => {
    await signOut(auth);
  }

  const handlePress = async (item: accountOptionType) => {
    switch (item.title) {
      case "editProfile":
        if (!user) {
          router.push("/(auth)/login");
        } else {
          router.push(item.routeName);
        }
        break;
      case "setting":
        router.push(item.routeName);
        break;
      case "privacyPolicy":
        router.push(item.routeName);
        break;
      default:
        break;
    }
  };

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
                        <Text className="text-white text-lg">{optionLabels[item.title]}</Text>                      
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

export default Account