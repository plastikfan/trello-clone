import { useDrag } from "react-dnd"
import { useAppState } from "./AppStateContext"
import { DragItem } from "./DragItem"
import { useEffect } from "react"
import { getEmptyImage } from "react-dnd-html5-backend"

// This is a hook (hooks use naming convention useXXX)
//
export const useItemDrag = (item: DragItem) => {
  const { dispatch } = useAppState()
  // pg92: added 'preview'
  //
  const [, drag, preview ] = useDrag({
    item,
    // This begin function is called when we start dragging an item
    //
    begin: () =>
      dispatch({
        type: "SET_DRAGGED_ITEM",
        payload: item
      }),
    // end fn called when we stop dragging
    //
    end: () => dispatch({
      type: "SET_DRAGGED_ITEM",
      payload: undefined
    })
  })

  useEffect(() => { // pg92
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return { drag }
}
