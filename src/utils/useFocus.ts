
import { useRef, useEffect } from "react"

export const useFocus = () => {
  // useRef is a react hook to gain access to rendered input element (pg55)
  //
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return ref
}
