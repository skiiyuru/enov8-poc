import { useUser } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { H1, H3, H6, Text, View, YStack } from "tamagui"

export default function Home() {
  const { user } = useUser()

  return (
    <YStack gap={"$2"} padding={"$4"}>
      <H3>Hi👋, {user?.emailAddresses[0].emailAddress}</H3>
      <Text>This is a skeleton app for Enov8 Solutions</Text>
      <H1>👨🏿‍💻</H1>
    </YStack>
  )
}
