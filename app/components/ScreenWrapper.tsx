import { ScreenWrapperProps } from "@/types";
import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, className = "" }: ScreenWrapperProps) => {
  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 bg-neutral-900 ${className}`}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
