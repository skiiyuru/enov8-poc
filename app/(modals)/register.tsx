import { useSignUp } from "@clerk/clerk-expo"
import { useRef, useState } from "react"
import { Button, H3, Spinner, Text, YStack } from "tamagui"
import { formData } from "./login"
import { useForm } from "react-hook-form"
import ControlledInput from "../../components/ControlledInput"
import DismissKeyboardHoc from "../../components/DismissKeyboardHoc"
import { useRouter } from "expo-router"

type verifyData = {
  code: string
}

function SignUpForm({ onPressSignUp, loading }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = useRef({})
  password.current = watch("password", "")

  return (
    <DismissKeyboardHoc>
      <YStack gap={"$4"} padding={"$4"}>
        <YStack gap={"$2"}>
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
          />
          <ControlledInput
            name={"confirm-password"}
            control={control}
            rules={{
              required: true,
              validate: (value: any) =>
                value === password.current || "The passwords do not match",
            }}
            error={errors.confirmPassword}
          />
          <Button
            my={"$2"}
            theme={"active"}
            disabled={!isValid || loading}
            icon={loading ? () => <Spinner /> : undefined}
            onPress={handleSubmit(onPressSignUp)}
          >
            Continue
          </Button>
        </YStack>
      </YStack>
    </DismissKeyboardHoc>
  )
}

function VerifyForm({ onPressVerify, loading, enteredEmail }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      code: "",
    },
  })
  return (
    <YStack gap={"$4"} padding={"$4"}>
      <YStack gap={"$2"}>
        <H3>Email Verification</H3>
        <Text color={"gray"}>
          Enter the code that we just sent to your email: {enteredEmail}
        </Text>
        <ControlledInput
          name={"code"}
          control={control}
          rules={{
            required: true,
          }}
          error={errors.code}
        />

        <Button
          my={"$2"}
          theme={"active"}
          disabled={!isValid || loading}
          icon={loading ? () => <Spinner /> : undefined}
          onPress={handleSubmit(onPressVerify)}
        >
          Verify
        </Button>
      </YStack>
    </YStack>
  )
}

export default function SignUp() {
  const router = useRouter()

  // form stuff
  const { isLoaded, signUp, setActive } = useSignUp()
  const [loading, setLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [enteredEmail, setEnteredEmail] = useState("")

  async function handleSignUp(data: formData) {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // save the email for verify form use
      setEnteredEmail(data.email)

      // change the UI to verify the email address
      setPendingVerification(true)
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(data: verifyData) {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      })

      await setActive({ session: completeSignUp.createdSessionId }).then(() =>
        router.replace("/(tabs)")
      )
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <VerifyForm
        loading={loading}
        onPressVerify={(data: verifyData) => handleVerify(data)}
        enteredEmail={enteredEmail}
      />
    )
  }

  return (
    <SignUpForm
      loading={loading}
      onPressSignUp={(data: formData) => handleSignUp(data)}
    />
  )
}
