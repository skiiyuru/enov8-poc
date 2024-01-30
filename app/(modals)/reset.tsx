import { useSignIn, useSignUp } from "@clerk/clerk-expo"
import { useRef, useState } from "react"
import { Button, H3, Spinner, Text, YStack } from "tamagui"
import { formData } from "./login"
import { useForm } from "react-hook-form"
import ControlledInput from "../../components/ControlledInput"
import DismissKeyboardHoc from "../../components/DismissKeyboardHoc"
import { useRouter } from "expo-router"

type requestData = {
  email: string
}

type resetData = {
  code: string
  password: string
  confirmPassword: string
}

function NewPasswordForm({ onPressSave, loading, enteredEmail }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = useRef({})
  password.current = watch("password", "")

  return (
    <DismissKeyboardHoc>
      <YStack gap={"$4"} padding={"$4"}>
        <Text>We have sent a verification code to: {enteredEmail}</Text>
        <YStack gap={"$2"}>
          <ControlledInput
            name={"code"}
            placeholder={"Verification code"}
            control={control}
            rules={{
              required: true,
            }}
            error={errors.code}
          />
          <ControlledInput
            name={"password"}
            placeholder={"New password"}
            control={control}
            rules={{
              required: true,
            }}
            error={errors.password}
          />
          <ControlledInput
            name={"confirmPassword"}
            placeholder={"Confirm new password"}
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
            onPress={handleSubmit(onPressSave)}
          >
            Save
          </Button>
        </YStack>
      </YStack>
    </DismissKeyboardHoc>
  )
}

function RequestForm({ onPressSend, loading }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
  })
  return (
    <YStack gap={"$4"} padding={"$4"}>
      <YStack gap={"$2"}>
        <H3>Forgot Password?</H3>
        <Text color={"gray"}>
          Enter your email address to receive a verification code.
        </Text>
        <ControlledInput
          name={"email"}
          placeholder={"Email"}
          control={control}
          rules={{
            required: true,
          }}
          error={errors.email}
        />

        <Button
          my={"$2"}
          theme={"active"}
          disabled={!isValid || loading}
          icon={loading ? () => <Spinner /> : undefined}
          onPress={handleSubmit(onPressSend)}
        >
          Send
        </Button>
      </YStack>
    </YStack>
  )
}

export default function Reset() {
  const router = useRouter()

  // form stuff
  const [enteredEmail, setEnteredEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const { signIn, setActive } = useSignIn()

  // Request a password reset code by email
  async function handleRequest(data: requestData) {
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      })

      // save the email for next step
      setEnteredEmail(data.email)

      setSuccessfulCreation(true)
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  // Reset the password with the code and the new password
  async function handleReset(data: resetData) {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      })

      alert("Password reset successfully")

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId })

      router.replace("/(tabs)")
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  if (successfulCreation) {
    return (
      <NewPasswordForm
        enteredEmail={enteredEmail}
        loading={loading}
        onPressSave={(data: resetData) => handleReset(data)}
      />
    )
  }

  return (
    <RequestForm
      loading={loading}
      onPressSend={(data: requestData) => handleRequest(data)}
    />
  )
}
