import { Link } from "expo-router"
import { H1, H6, Text, View, YStack } from "tamagui"

export default function Home() {
  return (
    <View>
      <Text>Hello home</Text>
      <Link href={"/(modals)/login"}>Login</Link>
    </View>
  )
}
