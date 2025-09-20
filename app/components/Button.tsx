import { CustomButtonProps } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Loading from "./Loading";

const Button = ({
  className = "",
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View
        className={`h-[52px] rounded-2xl justify-center items-center bg-transparent ${className}`}
      >
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`h-[52px] bg-lime-400 rounded-2xl justify-center items-center ${className}`}
    >
      {typeof children === "string" ? (
        <Text className="text-neutral-900 font-bold">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
