import React, { useState } from "react"
import { AddItemButton } from "./styles"
import { NewItemForm } from "./NewItemForm"

interface AddNewItemProps {
  onAdd(text: string): void
  toggleButtonText: string
  dark?: boolean
}

export const AddNewItem = (props: AddNewItemProps) => {
  const [showform, setShowForm] = useState(false);
  const { onAdd, toggleButtonText, dark } = props;

  if (showform) {
    return (
      <NewItemForm
        onAdd={text => {
          setShowForm(false)
        }}
      />
    )
  }

  return (
    <AddItemButton dark={dark} onClick={() => setShowForm(true)}>
      {toggleButtonText}
    </AddItemButton>
  )
}
