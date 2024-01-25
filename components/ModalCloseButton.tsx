import { TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"

export default function ModalCloseButton() {
  const router = useRouter()
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="close" size={24} color="black" />
    </TouchableOpacity>
  )
}
