import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export type BackButtonProps = {
  className?: string;
  iconSize?: number;
  iconColor?: string;
};

const BackButton = ({
  className = "",
  iconSize = 26,
  iconColor = "white",
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className={`absolute top-5 w-20 h-20 ${className}`}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
