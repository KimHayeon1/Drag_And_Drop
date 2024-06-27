import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DragUpdate, DraggableLocation, DropResult } from "react-beautiful-dnd";

import { columns } from "@/DragDrop/data";
import { isEven } from "@/utils";

import type { Columns, ItemType, Items, SelectedItems } from "@/DragDrop/model";

export default function useDragDrop(
  items: Items,
  setItems: Dispatch<SetStateAction<Items>>,
  selectedItems: SelectedItems,
) {
  const [isDropAble, setIsDropAble] = useState(true);

  const checkColumnConstraints = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const sourceColumn = source.droppableId as Columns;
    const destinationColumn = destination.droppableId as Columns;
    const sourceColumnIndex = columns.findIndex(
      (column) => column === sourceColumn,
    );
    const destinationColumnIndex = columns.findIndex(
      (column) => column === destinationColumn,
    );

    return sourceColumnIndex !== 0 || destinationColumnIndex !== 2;
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
        setIsDropAble(true);
        return;
      }

      const destinationColumn = destination.droppableId as Columns;

      const newItems: Items = {
        "No Status": [],
        Todo: [],
        "In Progress": [],
        Done: [],
      };

      const dropItems: ItemType[] = [];
      columns.forEach((column) => {
        items[column].forEach((item) => {
          if (selectedItems.selectedItemsId.has(item.id)) {
            dropItems.push(item);
          } else {
            newItems[column].push(item);
          }
        });
      });

      newItems[destinationColumn].splice(destination.index, 0, ...dropItems);
      setItems(newItems);
    },
    [items, selectedItems],
  );

  const onDragUpdate = useCallback(
    ({ source, destination }: DragUpdate) => {
      if (!destination) {
        return;
      }

      if (checkDropConstraints(source, destination)) {
        setIsDropAble(true);
      } else {
        setIsDropAble(false);
      }
    },
    [items],
  );

  return {
    isDropAble,
    onDragEnd,
    onDragUpdate,
  };
}
