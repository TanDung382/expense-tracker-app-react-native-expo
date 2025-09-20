import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import './global.css';

export default function RootLayout() {
  return <AuthProvider>
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: "#171717" }, }}> 
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)/welcome"/>
      <Stack.Screen
        name="(auth)/login"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/settingModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/policyModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
      <Stack.Screen
        name="(modals)/searchModal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          gestureEnabled: true, 
        }}
      />
    </Stack>
  </AuthProvider>
}
