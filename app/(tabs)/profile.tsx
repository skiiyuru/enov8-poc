// import { useAuth } from "@clerk/clerk-expo"
// import { Link } from "expo-router"
// import { Button, H2, Text, View, YStack } from "tamagui"

// export default function Profile() {
//   const { signOut, isSignedIn } = useAuth()

//   return (
//     <YStack gap="$2">
//       {isSignedIn ? (
//         <YStack>
//           <H2>You are signed in 😄</H2>
//           <Button onPress={() => signOut()}>Log out</Button>
//         </YStack>
//       ) : (
//         <Link href={"/(modals)/login"}>Log in</Link>
//       )}
//     </YStack>
//   )
// }

import { Text, View } from "tamagui"

export default function Profile() {
  return (
    <View flex={1} alignItems="center">
      <Text fontSize={20}>Profile</Text>
    </View>
  )
}
