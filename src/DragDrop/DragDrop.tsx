import { useState, useCallback } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Columns, ItemType, Items } from "@/DragDrop/model";
import { StyledColumn, StyledWrap } from "@/DragDrop/StyledDragDrop";
import Item from "@/DragDrop/Item";

export default function DragDrop() {
  const getItems = (count: number, column: Columns): ItemType[] =>
    Array.from({ length: count }, (_, index) => ({
      id: `item-${index}`,
      content: `item ${index}`,
      column,
    }));

  const [items, setItems] = useState<Items>({
    column1: getItems(10, "column1"),
    column2: [],
    column3: [],
    column4: [],
  });

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination) {
        return;
      }

      const scourceKey = source.droppableId as Columns;
      const destinationKey = destination.droppableId as Columns;

      if (scourceKey === "column1" && destinationKey === "column3") {
        return;
      }

      const scourceIndex = source.index;
      const destinationIndex = destination.index;

      if (
        items[destinationKey].length !== 0 &&
        scourceIndex % 2 === 0 &&
        destinationIndex % 2 === 0
      ) {
        return;
      }

      const newItems = { ...items };
      const [targetItem] = newItems[scourceKey].splice(source.index, 1);
      newItems[destinationKey].splice(destination.index, 0, targetItem);
      setItems(newItems);
    },
    [items],
  );

  const columns: Columns[] = ["column1", "column2", "column3", "column4"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                  <Item item={item} index={index} />
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
