import React from "react";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

interface LoadingProps extends ActivityIndicatorProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = "#a3e635",
  className = "",
  ...rest
}) => {
  return (
    <View
      className={`absolute inset-0 justify-center items-center bg-black/50 z-50 ${className}`}
    >
      <ActivityIndicator size={size} color={color} {...rest} />
    </View>
  );
};

export default Loading;
