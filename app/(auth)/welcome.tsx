import Button from '@/app/components/Button';
import ScreenWrapper from '@/app/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const Welcome = () => {

  const router = useRouter();

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center relative bg-neutral-900 gap-4">
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="absolute top-5 right-5">
          <Text
            className="text-white font-bold text-base"
          >
            Đăng nhập
          </Text>
        </TouchableOpacity>

        <Animated.Image
          entering={FadeIn.duration(1500)}
          source={require("@/assets/images/welcome.png")}
          className="w-full h-[300px]"
          resizeMode="contain"
        />

        <View className="px-8 space-y-3">
          <Animated.View entering={FadeInDown.duration(1500).delay(500).springify().damping(12)}>
            <Text
              className="text-xl font-bold text-white text-center"
            >
              Luôn chủ động
            </Text>
            <Text
              className="text-xl font-bold text-white text-center"
            >
              kiểm soát tài chính của bạn
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(1500).delay(700).springify().damping(12)}>
            <Text
              className="text-base text-gray-300 text-center mt-2"
            >
              Hãy sắp xếp tài chính hợp lý để xây dựng một cuộc sống tốt đẹp hơn
              trong tương lai.
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(1500).delay(900).springify().damping(12)}
          className="w-full px-7"
        >
          <Button
            onPress={() => router.push('/(auth)/register')}>
            <Text
              className="text-lg font-bold text-neutral-900 text-center"
            >
              Hãy bắt đầu
            </Text>
          </Button>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;