import React, { createContext, useReducer, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
import { findItemIndexById } from "./utils/findItemIndexById"
import { stat } from "fs"
import { moveItem } from "./moveItem"
import { DragItem } from "./DragItem"
import { save } from "./api"

// pg116, step9
//
import { withData } from "./withData"

// I think that Task/List make up the application 'model' that is the back end of
// of the ui abstractions Card/Column
//
interface Task { // (Card)
  id: string
  text: string
}

interface List { // (Column)
  id: string
  text: string
  tasks: Task[]
}

// App state being made available via the context
//
export interface AppState {
  lists: List[]
  draggedItem: DragItem | undefined
}

interface AppStateContextProps {
  state: AppState
  dispatch: React.Dispatch<Action>
}

// see: pg63
//
const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

// pg117, step9: wrap the AppStateProvider with withData
//
export const AppStateProvider = withData(
  // We don't have any other props other than the children, which is why PropsWithChildren
  // is passed empty object '{}'
  //
  ({ children, initialState }: React.PropsWithChildren<{ initialState: AppState }>) => {
    const [state, dispatch] = useReducer(appStateReducer, initialState)

    // pg111, step9
    // I think at some point, this the side effect we'll be invoking, is to invoke a
    // web request. So the 'save' will be invoked any time a change in state is
    // detected
    //
    useEffect(() => {
      save(state)
    }, [state])

    return (
      <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
      </AppStateContext.Provider>
    )
  }
)

// see: pg65
//
export const useAppState = () => {
  return useContext(AppStateContext)
}

// This is just some synthetic application state. Do not get concerned about weird
// looking ids, ie where's the c1 id?
//
// pg117, step9: this static appData is no longer required since we now initial
// using data from the back end
//
const appData: AppState = {
  draggedItem: undefined,
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }] // c2? => c1
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }] // c3? => c2
    }
  ]
}

// pg68
//
type Action =
  | {
    type: "ADD_LIST"
    payload: string
  }
  | {
    type: "ADD_TASK"
    payload: { text: string; listId: string }
  }
  | {
    type: "MOVE_LIST"
    payload: {
      dragIndex: number
      hoverIndex: number
    }
  }
  | { // step 5
    type: "SET_DRAGGED_ITEM"
    payload: DragItem | undefined
  }
  | { // pg99, step7
    type: "MOVE_TASK"
    payload: {
      dragIndex: number
      hoverIndex: number
      sourceColumn: string
      targetColumn: string
    }
  }

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: nanoid(), text: action.payload, tasks: [] }
        ]
      }
    }

    case "ADD_TASK": {
      const targetLaneIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      )
      state.lists[targetLaneIndex].tasks.push({
        id: nanoid(),
        text: action.payload.text
      })
      return {
        ...state
      }
    }

    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload
      state.lists = moveItem(state.lists, dragIndex, hoverIndex)
      return {
        ...state
      }
    }

    case "SET_DRAGGED_ITEM": {
      return { ...state, draggedItem: action.payload }
    }

    case "MOVE_TASK": {
      const {
        dragIndex,
        hoverIndex,
        sourceColumn,
        targetColumn
      } = action.payload
      const sourceLaneIndex = findItemIndexById(state.lists, sourceColumn)
      const targetLaneIndex = findItemIndexById(state.lists, targetColumn)
      const item = state.lists[sourceLaneIndex].tasks.splice(dragIndex, 1)[0]
      state.lists[targetLaneIndex].tasks.splice(hoverIndex, 0, item)
      return { ...state }
    }

    default: {
      return state
    }
  }
}

// pg80
//
export interface AppState {
  lists: List[]
  draggedItem: DragItem | undefined;
}
