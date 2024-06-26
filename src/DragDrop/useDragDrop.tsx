import { Dispatch, SetStateAction, useCallback } from "react";
import { DragUpdate, DraggableLocation, DropResult } from "react-beautiful-dnd";

import { isEven } from "@/utils";

import type { Columns, Items } from "@/DragDrop/model";

export default function useDragDrop(
  items: Items,
  setItems: Dispatch<SetStateAction<Items>>,
) {
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

  const checkColumnConstraints = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const sourceColumn = source.droppableId as Columns;
    const destinationColumn = destination.droppableId as Columns;

    const isFirstColumnToThirdColumn =
      sourceColumn === "column1" && destinationColumn === "column3";

    return !isFirstColumnToThirdColumn;
  };

  const checkEvenItemConstraints = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const sourceColumn = source.droppableId as Columns;
    const destinationColumn = destination.droppableId as Columns;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    // 다른 칼럼으로 이동 시에도 제약 적용
    // if (items[destinationColumn].length === 0) {
    //   return true;
    // }

    // if (
    //   sourceColumn === destinationColumn &&
    //   sourceIndex === destinationIndex
    // ) {
    //   return true;
    // }

    // if (isEven(sourceIndex) && isEven(destinationIndex)) {
    //   return false;
    // }

    // return true;

    // 칼럼 내 이동 시 제약 적용
    if (sourceColumn !== destinationColumn) {
      return true;
    }

    if (sourceIndex === destinationIndex) {
      return true;
    }

    if (isEven(sourceIndex) && isEven(destinationIndex)) {
      return false;
    }

    return true;
  };

  const checkDropConstraints = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const passColumnConstraints = checkColumnConstraints(source, destination);
    const passEvenItemConstraints = checkEvenItemConstraints(
      source,
      destination,
    );

    return passColumnConstraints && passEvenItemConstraints;
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

  return {
    items,
    setIsDropAble,
    checkDropConstraints,
    onDragEnd,
    onDragUpdate,
  };
}
