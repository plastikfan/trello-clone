
import React, { PropsWithChildren, ComponentType } from "react"
import { useState } from "react"
import { AppState } from "./AppStateContext"
import { load } from "./api"

export const withData = (
  WrappedComponent: ComponentType<PropsWithChildren<{ initialState: AppState }>>
) => {
  return ({ children }: PropsWithChildren<{}>) => {
    // const initialState: AppState = { lists: [], draggedItem: undefined }

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()
    const [initialState, setInitialState] = useState<AppState>({
      lists: [],
      draggedItem: undefined,
    })

    React.useEffect(() => {
      // HOC ?? Logic
      //

      // async/await
      //
      const fetchInitialState = async () => { // Marked as async, because it awaits a promise internally
        try {
          const data = await load() // await on the returned promise
          setInitialState(data)
        } catch (e) {
          setError(e)
        }
        setIsLoading(false)
      }
      fetchInitialState()
    }, [])

    if (isLoading) {
      return <div>Loading</div>
    }
    if (error) {
      return <div>{error.message}</div>
    }

    return (
      <WrappedComponent initialState={initialState}>
        {children}
      </WrappedComponent>
    )
  }
}
