import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome")
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Image
        className="w-40 h-40"
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
  );
};

export default Index;
