import { useState, useCallback } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DragUpdate,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Columns, ItemType, Items } from "@/DragDrop/model";
import { StyledColumn, StyledWrap } from "@/DragDrop/StyledDragDrop";
import Item from "@/DragDrop/Item";
import { isEven } from "@/utils";

export default function DragDrop() {
  const getItems = (count: number, column: Columns): ItemType[] =>
    Array.from({ length: count }, (_, index) => ({
      id: `item-${index}`,
      content: `item ${index}`,
      column,
      isDropAble: true,
    }));

  const [items, setItems] = useState<Items>({
    column1: getItems(10, "column1"),
    column2: [],
    column3: [],
    column4: [],
  });

  const setIsDropAble = (source: DraggableLocation, isDropAble: boolean) => {
    const sourceColumn = source.droppableId as Columns;
    const sourceIndex = source.index;
    const newItems = { ...items };
    newItems[sourceColumn][sourceIndex] = {
      ...newItems[sourceColumn][sourceIndex],
      isDropAble: isDropAble,
    };
    setItems(newItems);
  };

  const checkDropConstraints = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const sourceColumn = source.droppableId as Columns;
    const destinationColumn = destination.droppableId as Columns;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const isFirstColumnToThirdColumn =
      sourceColumn === "column1" && destinationColumn === "column3";

    // 드래그 제약 조건(짝수 아이템) - 다른 칼럼으로 이동 시에도 적용
    // const isEvenItemToEvenItemFront =
    //   items[destinationColumn].length !== 0 &&
    //   isEven(sourceIndex) &&
    //   isEven(destinationIndex);

    // 드래그 제약 조건(짝수 아이템) - 칼럼 내 이동 시 적용
    const isEvenItemToEvenItemFront =
      sourceColumn === destinationColumn &&
      isEven(sourceIndex) &&
      isEven(destinationIndex);

    if (isFirstColumnToThirdColumn || isEvenItemToEvenItemFront) {
      return false;
    }

    return true;
  };

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination) {
        return;
      }

      if (!checkDropConstraints(source, destination)) {
        setIsDropAble(source, true);
        return;
      }

      const sourceColumn = source.droppableId as Columns;
      const destinationColumn = destination.droppableId as Columns;

      const newItems = { ...items };
      const [targetItem] = newItems[sourceColumn].splice(source.index, 1);
      newItems[destinationColumn].splice(destination.index, 0, targetItem);
      setItems(newItems);
    },
    [items],
  );

  const onDragUpdate = useCallback(
    ({ source, destination }: DragUpdate) => {
      if (!destination) {
        return;
      }

      if (checkDropConstraints(source, destination)) {
        setIsDropAble(source, true);
      } else {
        setIsDropAble(source, false);
      }
    },
    [items],
  );

  const columns: Columns[] = ["column1", "column2", "column3", "column4"];

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
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
