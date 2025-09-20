import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#404040",
          height: 60,
          borderColor: "#0F0D23",
        },
        tabBarActiveTintColor: '#a3e635',
        tabBarInactiveTintColor: '#6b7220',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Trang chủ',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          headerShown: false,
          title: 'Ví',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          headerShown: false,
          title: 'Biểu đồ',
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name={focused ? 'area-chart' : 'bar-chart'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
          title: 'Tôi',
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name={focused ? 'user' : 'user'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
