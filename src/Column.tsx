
import React, { useRef } from "react"
import { ColumnContainer, ColumnTitle } from "./styles"
import { useAppState } from "./AppStateContext"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useItemDrag } from "./useItemDrag"
import { useDrop } from "react-dnd"
import { DragItem } from "./DragItem"
import { isHidden } from "./utils/isHidden"

// (STEP 2), the alternative to using React.PropsWithChildren<ColumnProps> would
// be to add the children to out interface manually, so ColumnProps would have 
// another entry: 'children?: React.ReactNode'
//
interface ColumnProps {
  text: string
  index: number
  id: string
  isPreview?: boolean // pg93
}

// STEP 1
// export const Column = ({ text }: ColumnProps) => {
//   return (
//     <ColumnContainer>
//       <ColumnTitle>{text}</ColumnTitle>
//     </ColumnContainer>
//   )
// }

// STEP 2
// NB: React.PropsWithChildren is defined as:
// type React.PropsWithChildren<P> = P & {
//    children ?: React.ReactNode;
// }
//
export const Column = ({ text, index, id, isPreview }: ColumnProps) => {
  const { state, dispatch } = useAppState()
  
  // pg82 ref is a drag target, which is a div element
  //
  const ref = useRef<HTMLDivElement>(null)

  // Step5/pg84
  // Line 24:18:  React Hook "useDrop" cannot be called at the top level
  //
  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item: DragItem) {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      dispatch({ type: "MOVE_LIST", payload: { dragIndex, hoverIndex } })
      item.index = hoverIndex
    }
  })

  const { drag } = useItemDrag({ type: "COLUMN", id, index, text })
  drag(drop(ref))

  return (
    // Step 5 (pg82)
    // add ref={ref}
    //
    <ColumnContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(isPreview, state.draggedItem, "COLUMN", id)}
    >

      <ColumnTitle>{text}</ColumnTitle>
      {
        state.lists[index].tasks.map((task, i) => (
          <Card text={task.text} key={task.id} index={i}/>
        ))
      }
      <AddNewItem
      toggleButtonText="+ Add another task"
      onAdd={text =>
      dispatch({ type: "ADD_TASK", payload: { text, listId: id}})}
      dark
      />
    </ColumnContainer>
  )
}
