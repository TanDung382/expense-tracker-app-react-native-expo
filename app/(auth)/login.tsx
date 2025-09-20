import { useAuth } from "@/contexts/authContext";
import { FontAwesome5, Zocial } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../components/BackButton";
import Loading from "../components/Loading";
import ModalWrapper from "../components/ModalWrapper";

const IMAGE_HEIGHT = 250;
const IMAGE_HEIGHT_SMALL = 100;

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const imageHeight = useRef(new Animated.Value(IMAGE_HEIGHT)).current;
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginUser } = useAuth();

  const handleSubmit = async () => {

    if (!emailRef.current && !passwordRef.current) {
      Alert.alert("Đăng nhập", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!emailRef.current) {
      Alert.alert('Đăng nhập', "Vui lòng nhập tài khoản");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRef.current)) {
      Alert.alert("Đăng nhập", "Email không hợp lệ");
      return;
    }

    if (!passwordRef.current) {
      Alert.alert('Đăng nhập', "Vui lòng nhập mật khẩu");
      return;
    }

    if (passwordRef.current.length < 6) {
      Alert.alert("Đăng nhập", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    const res = await loginUser(
      emailRef.current,
      passwordRef.current,
    );
    setIsLoading(false);
    if (res.success) {
      router.dismissAll();
      router.replace("/(tabs)");
    } else {
      Alert.alert('Đăng nhập', res.msg);
    }
  }

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardWillShowSub = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(imageHeight, {
        toValue: IMAGE_HEIGHT_SMALL,
        duration: event?.duration || 350,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHideSub = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(imageHeight, {
        toValue: IMAGE_HEIGHT,
        duration: event?.duration || 350,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, [imageHeight]);

  return (
    <ModalWrapper className="justify-end ">
      {isLoading && <Loading />}
      <View className="h-[96%] bg-neutral-900 rounded-t-3xl p-5 items-center gap-4">
        <BackButton iconColor="white" className="left-5"/>
        <Text className="text-2xl font-bold text-white text-center mb-6">
          Đăng nhập
        </Text>

        <Animated.Image
          source={require("@/assets/images/welcome.png")}
          style={{ width: "100%", height: imageHeight, resizeMode: "contain" }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-11/12 space-y-4"
        >
          <View className="flex-row items-center bg-neutral-800 rounded-full p-3 mb-3 border border-neutral-600">
            <Zocial name="email" size={20} color="white" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#a3a3a3"
              onChangeText={(value) => (emailRef.current = value)}
              className="ml-2 text-white flex-1"
            />
          </View>

          <View className="flex-row items-center bg-neutral-800 rounded-full p-3 border border-neutral-600">
            <FontAwesome5 name="lock" size={20} color="white" />
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#a3a3a3"
              onChangeText={(value) => (passwordRef.current = value)}
              secureTextEntry
              className="ml-2 text-white flex-1"
            />
          </View>
        </KeyboardAvoidingView>

        <View className="w-11/12 flex-row justify-end">
          <Text className="text-sm text-lime-500">
            Quên mật khẩu?
          </Text>
        </View>

        <View className="w-11/12">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-lime-500 rounded-full py-3 px-6">
            <Text className="text-neutral-700 font-bold text-center text-lg">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>   
        
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-sm text-gray-600">
            Không có tài khoản?
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-sm text-lime-500 font-semibold ml-1">
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>        
      </View>
    </ModalWrapper>
  );
};

export default Login;
