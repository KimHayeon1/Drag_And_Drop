import { KeyboardEvent, MouseEvent } from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";

import { StyledItem } from "@/DragDrop/StyledDragDrop";

import type { Columns, ItemState, ItemType } from "@/DragDrop/model";

export default function Item({
  item,
  index,
  column,
  toggleSelectionInGroup,
  multiSelectTo,
  toggleSelection,
  itemState,
}: {
  item: ItemType;
  index: number;
  column: Columns;
  toggleSelectionInGroup: (itemId: string) => void;
  multiSelectTo: (itemId: string, itemIndex: number, column: Columns) => void;
  toggleSelection: (itemId: string) => void;
  itemState: ItemState;
}) {
  const onKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    snapshot: DraggableStateSnapshot,
  ) => {
    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    performAction(event);
  };

  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    if (event.defaultPrevented) {
      return;
    }

    // 왼쪽 버튼
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    performAction(event);
  };

  const wasToggleInSelectionGroupKeyUsed = (
    event: MouseEvent | KeyboardEvent,
  ) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  const wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) =>
    event.shiftKey;

  const performAction = (event: MouseEvent | KeyboardEvent) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(item.id);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(item.id, index, column);
      return;
    }

    toggleSelection(item.id);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <StyledItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $itemState={itemState}
          $isDropAble={item.isDropAble}
          onClick={onClick}
          onKeyDown={(event) => onKeyDown(event, snapshot)}
        >
          {item.content}
        </StyledItem>
      )}
    </Draggable>
  );
}
