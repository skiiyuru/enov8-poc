import { Tabs } from "expo-router"
import { H4 } from "tamagui"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          // tabBarIcon: Home,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          // tabBarIcon: Search,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          // tabBarIcon: User2,
        }}
      />
    </Tabs>
  )
}
