import { FocusEvent, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import AddBtn from "@/DragDrop/AddBtn/AddBtn";
import { columns, createItem } from "@/DragDrop/data";
import { items as itemsData } from "@/DragDrop/data";
import Item from "@/DragDrop/Item";
import {
  StyledColumn,
  StyledList,
  StyledMain,
  StyledWrap,
} from "@/DragDrop/StyledDragDrop";
import useDragDrop from "@/DragDrop/useDragDrop";
import useMultiSelect from "@/DragDrop/useMultiSelect";

import type { Items, ItemState } from "@/DragDrop/model";

export default function DragDrop() {
  const [items, setItems] = useState<Items>(itemsData);
  const [isDragging, setIsDragging] = useState(false);
  const [isTabPressed, setIsTabPressed] = useState(false);

  const {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    toggleSelectionByKeybord,
    multiSelectByKeybord,
    selectItem,
    addItemInSelectionGroup,
    initializeSelectedItems,
  } = useMultiSelect(items);
  const { onDragEnd, onDragUpdate, isDropAble } = useDragDrop(
    items,
    setItems,
    selectedItems,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsTabPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsTabPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isTabPressed]);

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      initializeSelectedItems();
    }
  };

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
        <StyledWrap onBlur={onBlur}>
          {columns.map((column, i) => (
            <Droppable key={column} droppableId={column}>
              {(provided, snapshot) => (
                <StyledColumn
                  id={column.replace(/ /g, "-").toLowerCase()}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  $isDraggingOver={snapshot.isDraggingOver}
                >
                  <h2>{column}</h2>
                  <StyledList>
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
                            toggleSelectionByKeybord,
                            multiSelectByKeybord,
                            selectItem,
                          }}
                          itemState={itemState}
                          dragState={{
                            selectedItemsCnt:
                              selectedItems.selectedItemsId.size,
                            isDropAble,
                          }}
                          isTabPressed={isTabPressed}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </StyledList>
                  {i === 0 && (
                    <AddBtn
                      addItem={() => {
                        const item = createItem("아이템");
                        setItems((prev) => ({
                          ...prev,
                          [column]: [...prev[column], item],
                        }));
                      }}
                    />
                  )}
                </StyledColumn>
              )}
            </Droppable>
          ))}
        </StyledWrap>
      </DragDropContext>
    </StyledMain>
  );
}
