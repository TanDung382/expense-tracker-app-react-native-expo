import { getFilePath } from "@/services/imageService";
import { ImageUploadProps } from "@/types";
import * as ImagePicker from 'expo-image-picker';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  placeholder = "",
}: ImageUploadProps) => {

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onSelect(result.assets[0])
    }
  };
  return (
    <View>
      {
        !file && (
          <TouchableOpacity
            onPress={pickImage}
            className="h-14 w-full flex-row items-center justify-center 
                      rounded-lg border border-dashed border-neutral-500 
                      bg-neutral-700 gap-2"
          >
            <Icons.UploadSimpleIcon size={20} color="#e5e5e5" />
            {placeholder && (
              <Text className="text-neutral-200 text-sm">{placeholder}</Text>
            )}
          </TouchableOpacity>
        )
      }
      {
        file && (
        <View className="relative w-[150px] h-[150px] rounded-xl overflow-hidden">
          <Image
            source={{ uri: getFilePath(file) }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={onClear}
            className="absolute top-2 right-2 bg-black/30 p-[2px] rounded-full"
          >
            <Icons.XCircleIcon size={28} weight="fill" color="white" />
          </TouchableOpacity>
        </View>
        )
      }
      
    </View>
  )
}

export default ImageUpload