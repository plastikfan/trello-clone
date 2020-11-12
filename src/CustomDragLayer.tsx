
import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { Column } from "./Column"
import { CustomDragLayerContainer } from "./styles"


// Step6, pg89
//
function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: "none"
    }
  }

  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

// Step6, pg88
//
// Cannot find name 'CustomDragLayerContainer'.ts(2304)
// 'React' refers to a UMD global, but the current file is a module.Consider adding an import instead.ts(2686)

const CustomDragLayer: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  return isDragging ? (
    // currentOffset is not defined
    //
    <CustomDragLayerContainer>
      <div style={getItemStyles(currentOffset)}>
        <Column
          id={item.id}
          text={item.text}
          index={item.index}
        />
      </div>
    </CustomDragLayerContainer>
  ) : null
}

// const CustomDragLayer: React.FC = () => {
//   const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
//     item: monitor.getItem(),
//     currentOffset: monitor.getSourceClientOffset(),
//     isDragging: monitor.isDragging()
//   }))

//   if (!isDragging) {
//     return null
//   }

//   return (
//     <CustomDragLayerContainer>
//       <div style={getItemStyles(currentOffset)}>
//         <Column
//           id={item.id}
//           text={item.text}
//           index={item.index}
//         />
//       </div>
//     </CustomDragLayerContainer>
//   )
// }


export default CustomDragLayer;
