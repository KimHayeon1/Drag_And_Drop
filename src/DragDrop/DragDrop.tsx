import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { columns } from "@/DragDrop/data";
import { items as itemsData } from "@/DragDrop/data";
import Item from "@/DragDrop/Item";
import {
  StyledColumn,
  StyledMain,
  StyledWrap,
} from "@/DragDrop/StyledDragDrop";
import useDragDrop from "@/DragDrop/useDragDrop";
import useMultiSelect from "@/DragDrop/useMultiSelect";

import type { Items, ItemState } from "@/DragDrop/model";

export default function DragDrop() {
  const [items, setItems] = useState<Items>(itemsData);
  const [isDragging, setIsDragging] = useState(false);

  const {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    multiSelectByKeybord,
    addItemInSelectionGroup,
  } = useMultiSelect(items);
  const { onDragEnd, onDragUpdate, isDropAble } = useDragDrop(
    items,
    setItems,
    selectedItems,
  );

  return (
    <StyledMain>
      <h1>BUCKET LIST</h1>
      <DragDropContext
        onDragEnd={(e) => {
          setIsDragging(false);
          onDragEnd(e);
        }}
        onDragUpdate={onDragUpdate}
        onDragStart={(e) => {
          setIsDragging(true);
          addItemInSelectionGroup(e);
        }}
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
                  <ul>
                    {items[column].map((item, index) => {
                      let itemState: ItemState = "default";

                      if (selectedItems.currItem === item.id) {
                        itemState = "current";
                      } else if (
                        isDragging &&
                        selectedItems.selectedItemsId.has(item.id)
                      ) {
                        itemState = "draggingGroup";
                      } else if (selectedItems.selectedItemsId.has(item.id)) {
                        itemState = "selectionGroup";
                      }

                      return (
                        <Item
                          key={item.id}
                          item={item}
                          index={index}
                          multiSelectionFuncs={{
                            toggleSelectionInGroup,
                            multiSelectTo,
                            toggleSelection,
                            multiSelectByKeybord,
                          }}
                          itemState={itemState}
                          dragState={{
                            selectedItemsCnt:
                              selectedItems.selectedItemsId.size,
                            isDropAble,
                          }}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                </StyledColumn>
              )}
            </Droppable>
          ))}
        </StyledWrap>
      </DragDropContext>
    </StyledMain>
  );
}
