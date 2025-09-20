import { ModalWrapperProps } from "@/types";
import React from "react";
import { KeyboardAvoidingView, Platform, StatusBar, View } from "react-native";
import Reanimated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

const ModalWrapper = ({
  children,
  className = "",
  entering,
  exiting,
}: ModalWrapperProps & { entering?: any; exiting?: any }) => {
  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Reanimated.View
          className={`flex-1 ${className}`}
          entering={entering || SlideInDown.duration(500)}
          exiting={exiting || SlideOutDown.duration(500)}
        >
          {children}
        </Reanimated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ModalWrapper;
