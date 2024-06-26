import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { columns } from "@/DragDrop/data";
import { items as itemsData } from "@/DragDrop/data";
import Item from "@/DragDrop/Item";
import { StyledColumn, StyledWrap } from "@/DragDrop/StyledDragDrop";
import useDragDrop from "@/DragDrop/useDragDrop";
import useMultiSelect from "@/DragDrop/useMultiSelect";

import type { Items } from "@/DragDrop/model";

export default function DragDrop() {
  const [items, setItems] = useState<Items>(itemsData);

  const { onDragEnd, onDragUpdate } = useDragDrop(items, setItems);
  const {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    addItemInSelectionGroup,
  } = useMultiSelect(items);

  return (
    <DragDropContext
      onDragEnd={(e) => {
        onDragEnd(e);
        addItemInSelectionGroup(e);
      }}
      onDragUpdate={onDragUpdate}
    >
      <StyledWrap>
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided, snapshot) => (
              <StyledColumn
                {...provided.droppableProps}
                ref={provided.innerRef}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                <h2>{column}</h2>
                {items[column].map((item, index) => (
                  <Item
                    key={item.id}
                    item={item}
                    index={index}
                    column={column}
                    toggleSelectionInGroup={toggleSelectionInGroup}
                    multiSelectTo={multiSelectTo}
                    toggleSelection={toggleSelection}
                    isSelected={
                      selectedItems
                        ? selectedItems.selectedItemsId.has(item.id)
                        : false
                    }
                  />
                ))}
                {provided.placeholder}
              </StyledColumn>
            )}
          </Droppable>
        ))}
      </StyledWrap>
    </DragDropContext>
  );
}
