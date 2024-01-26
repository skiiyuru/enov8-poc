import { type ReactNode } from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"

type DismissKeyboardHocProps = {
  children: ReactNode
}

export default function DismissKeyboardHoc({
  children,
}: DismissKeyboardHocProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  )
}
