import "../tamagui.css"

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { SplashScreen, Stack, useRouter } from "expo-router"
import { TouchableOpacity, useColorScheme } from "react-native"
import { TamaguiProvider, Text } from "tamagui"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import * as SecureStore from "expo-secure-store"
import Ionicons from "@expo/vector-icons/Ionicons"

import { config } from "../tamagui.config"
import { useFonts } from "expo-font"
import { useEffect } from "react"
import ModalCloseButton from "../components/ModalCloseButton"

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  // Automatically open login if user is not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(modals)/login")
    }
  }, [isLoaded])
  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(modals)/login"
            options={{
              presentation: "modal",
              title: "Log in",

              headerLeft: () => <ModalCloseButton />,
            }}
          />
          <Stack.Screen
            name="(modals)/register"
            options={{
              presentation: "modal",
              title: "Sign up",

              headerLeft: () => <ModalCloseButton />,
            }}
          />
          <Stack.Screen
            name="(modals)/reset"
            options={{
              presentation: "modal",
              title: "Reset password",

              headerLeft: () => <ModalCloseButton />,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
