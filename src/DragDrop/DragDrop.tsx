import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState, useCallback } from "react";
import { Items } from "@/model";
import { StyledItem, StyledColumn } from "@/DragDrop/StyledColumn";

export default function DragDrop() {
  const getItems = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
      id: `item-${index}`,
      content: `item ${index}`,
    }));

  const [items, setItems] = useState<Items>(getItems(10));

  const reorder = (list: Items, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index,
      );

      setItems(newItems);
    },
    [items],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <StyledColumn
            {...provided.droppableProps}
            ref={provided.innerRef}
            $isDraggingOver={snapshot.isDraggingOver}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <StyledItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    $isDragging={snapshot.isDragging}
                  >
                    {item.content}
                  </StyledItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </StyledColumn>
        )}
      </Droppable>
    </DragDropContext>
  );
}
