import React, { useReducer } from "react"
import { AddNewItem } from "./AddNewItem"
import { useAppState } from "./AppStateContext"
import { Column } from "./Column"
import { AppContainer } from "./styles"
// import { Column } from "./Column"
// import { Card } from "./Card"
// import { AppContainer } from "./styles";
// import { AddNewItem } from "./AddNewItem"

// step6, pg91
//
import CustomDragLayer from "./CustomDragLayer"

interface State {
  count: number;
}

type Action =
  | {
    type: "increment"
  }
  | {
    type: "decrement"
  }

const counterReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 }
    case "decrement":
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

// pg60
//
// const __App = () => {
//   const [state, dispatch] = useReducer(counterReducer, { count: 0 })
//   return (
//     <>
//       <p>Count: {state.count}</p>
//       <button onClick={() => dispatch({ type: "decrement" })}>-</button>
//       <button onClick={() => dispatch({ type: "increment" })}>+</button>
//     </>
//   )
// }

// const App = () => {
//   return (
//     <AppContainer>
//       <Column text="To Do">
//         <Card text="Generate app scaffold"></Card>
//       </Column>

//       <Column text="In Progress">
//         <Card text="Learn Typescript"></Card>
//       </Column>

//       <Column text="Done">
//         <Card text="Begin to use static typing"></Card>
//       </Column>
//       <AddNewItem toggleButtonText="+ Add another list" onAdd={console.log}/>
//     </AppContainer>
//   );
// }

// pg60
//
const App = () => {
  const { state, dispatch } = useAppState()

  // pg91
  // insert <CustomDragLayer /> at the top of <AppContainer>
  //
  return (
    <AppContainer>
      <CustomDragLayer />
      {state.lists.map((list, i) => (
        <Column id={list.id} text={list.text} key={list.id} index={i} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another list"
        onAdd={text => dispatch({ type: "ADD_LIST", payload: text})}
      />
    </AppContainer>
  )
}

export default App;
