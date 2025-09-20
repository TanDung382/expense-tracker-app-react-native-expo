import { useAuth } from "@/contexts/authContext";
import { FontAwesome5, Zocial } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const Register = () => {
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const imageHeight = useRef(new Animated.Value(IMAGE_HEIGHT)).current;
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {

    if (!emailRef.current && !passwordRef.current && !nameRef.current) {
      Alert.alert("Đăng ký", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!emailRef.current) {
      Alert.alert('Đăng ký', "Vui lòng nhập tài khoản");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRef.current)) {
      Alert.alert("Đăng ký", "Email không hợp lệ");
      return;
    }

    if (!nameRef.current) {
      Alert.alert('Đăng ký', "Vui lòng nhập tên");
      return;
    }

    if (!passwordRef.current) {
      Alert.alert('Đăng ký', "Vui lòng nhập mật khẩu");
      return;
    }

    if (passwordRef.current.length < 6) {
      Alert.alert("Đăng ký", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    
    setIsLoading(false);
    // console.log(" register: ", res);
    if (!res.success) {
      Alert.alert('Đăng ký', res.msg);
    }

  }

  const handleClose = () => {
    setTimeout(() => {
      router.push("/(auth)/login");
    }, 100);
  };

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
          Đăng ký
        </Text>

        {/* Logo có animation khi bàn phím bật */}
        <Animated.Image
          source={require("@/assets/images/welcome.png")}
          style={{ width: "100%", height: imageHeight, resizeMode: "contain" }}
        />

        {/* Form Đăng ký */}
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
          <View className="flex-row items-center bg-neutral-800 rounded-full p-3 mb-3 border border-neutral-600">
            <FontAwesome5 name="user" size={20} color="white" />
            <TextInput
              placeholder="Tên"
              placeholderTextColor="#a3a3a3"
              onChangeText={(value) => (nameRef.current = value)}
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

        <View className="w-11/12">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-lime-500 rounded-full py-3 px-6">
            <Text className="text-neutral-700 font-bold text-center text-lg">
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>   
        
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-sm text-neutral-400">
            Đã có tài khoản?
          </Text>
          <TouchableOpacity onPress={(handleClose)}>
            <Text className="text-sm text-lime-500 font-semibold ml-1">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>        
      </View>
    </ModalWrapper>
  );
};

export default Register;
