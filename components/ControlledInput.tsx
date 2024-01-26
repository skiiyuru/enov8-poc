import { ComponentPropsWithRef, forwardRef, type ReactNode } from "react"
import { Controller } from "react-hook-form"
import { Input, Text, YStack } from "tamagui"

//TODO define proper type:
type ControlledInputProps = ComponentPropsWithRef<any>

const ControlledInput = forwardRef(function CustomInput(
  { children, error, name, ...otherControllerProps }: ControlledInputProps,
  ref
) {
  return (
    <YStack gap={"$2"}>
      <Controller
        ref={ref}
        name={name}
        {...otherControllerProps}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize={"none"}
            id={name}
            size="$4"
            placeholder={name[0].toUpperCase() + name.slice(1)}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {error && <Text color="red">This is required.</Text>}
      {children}
    </YStack>
  )
})

export default ControlledInput
