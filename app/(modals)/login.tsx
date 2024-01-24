import { useOAuth, useSignIn } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, Input, Spinner, Text, YStack } from "tamagui"
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"

type formData = {
  email: string
  password: string
}

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

export default function Login() {
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
      await setActive({ session: completeSignIn.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  //0Auth stuff
  useWarmUpBrowser()

  const router = useRouter()
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
        router.back()
      }
    } catch (err) {
      console.error("OAuth error", err)
    }
  }

  return (
    <YStack gap="$2" padding="$4">
      <YStack>
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="email"
              size="$4"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text color="red">This is required.</Text>}
      </YStack>

      <YStack>
        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="password"
              size="$4"
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text color="red">This is required.</Text>}
      </YStack>

      <Button
        theme={"active"}
        disabled={!isValid || loading}
        icon={loading ? () => <Spinner /> : undefined}
        onPress={handleSubmit(handleLogin)}
      >
        Login
      </Button>
    </YStack>
  )
}
