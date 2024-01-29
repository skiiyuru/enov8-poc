import { useOAuth, useSignIn } from "@clerk/clerk-expo"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Button,
  Input,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui"
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"
import ControlledInput from "../../components/ControlledInput"
import DismissKeyboardHoc from "../../components/DismissKeyboardHoc"

export type formData = {
  email: string
  password: string
}

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

export default function Login() {
  const router = useRouter()

  // form stuff
  const [loading, setLoading] = useState(false)
  const { signIn, setActive, isLoaded } = useSignIn()
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleLogin(data: formData) {
    if (!isLoaded) {
      return
    }
    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId }).then(() =>
        router.navigate("/(tabs)")
      )
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  //0Auth stuff
  useWarmUpBrowser()

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" })
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" })
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  })

  async function handle0Auth(strategy: Strategy) {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy]

    try {
      const { createdSessionId, setActive } = await selectedAuth()

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        router.navigate("/")
      }
    } catch (err) {
      console.error("OAuth error", err)
    }
  }

  return (
    <DismissKeyboardHoc>
      <YStack gap="$4" padding="$4">
        <YStack gap="$2">
          <ControlledInput
            name={"email"}
            control={control}
            rules={{
              required: true,
            }}
            error={errors.email}
          />

          <ControlledInput
            name={"password"}
            control={control}
            rules={{
              required: true,
            }}
            error={errors.password}
          >
            <XStack px={"$1"} justifyContent="space-between">
              <Link style={{ color: "gray" }} href={"/(modals)/reset"}>
                Forgot password?
              </Link>
              <Link style={{ color: "gray" }} href={"/(modals)/register"}>
                Sign up?
              </Link>
            </XStack>
          </ControlledInput>

          <Button
            my={"$2"}
            theme={"active"}
            disabled={!isValid || loading}
            icon={loading ? () => <Spinner /> : undefined}
            onPress={handleSubmit(handleLogin)}
          >
            Continue
          </Button>

          {/* <Link href={"/(modals)/register"} asChild>
            <Button
              variant="outlined"
              borderColor={"lightgray"}
              borderWidth={"$0.5"}
              theme={"active"}
            >
              Sign up
            </Button>
          </Link> */}
        </YStack>
        <XStack gap={"$2"} alignItems="center">
          <Separator borderColor={"lightgray"} />
          <Text color={"gray"} textAlign="center">
            or
          </Text>
          <Separator borderColor={"lightgray"} />
        </XStack>
        <YStack gap={"$4"}>
          <Button
            icon={() => <Ionicons name="logo-google" size={24} color="black" />}
            theme={"active"}
            onPress={() => handle0Auth(Strategy.Google)}
          >
            Continue with Google
          </Button>
          <Button
            icon={() => <Ionicons name="logo-apple" size={24} color="black" />}
            theme={"active"}
            onPress={() => handle0Auth(Strategy.Apple)}
          >
            Continue with Apple
          </Button>
          <Button
            icon={() => (
              <Ionicons name="logo-facebook" size={24} color="black" />
            )}
            theme={"active"}
            onPress={() => handle0Auth(Strategy.Facebook)}
          >
            Continue with Facebook
          </Button>
        </YStack>
      </YStack>
    </DismissKeyboardHoc>
  )
}
