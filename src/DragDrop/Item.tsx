import { KeyboardEvent, MouseEvent } from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";

import { StyledItem } from "@/DragDrop/StyledDragDrop";

import type {
  ItemState,
  ItemType,
  MultiSelectionFuncs,
} from "@/DragDrop/model";

export default function Item({
  item,
  index,
  multiSelectionFuncs,
  itemState,
  dragState,
}: {
  item: ItemType;
  index: number;
  multiSelectionFuncs: MultiSelectionFuncs;
  itemState: ItemState;
  dragState: {
    selectedItemsCnt: number;
    isDropAble: boolean;
  };
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
      multiSelectionFuncs.toggleSelectionInGroup(item.id);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectionFuncs.multiSelectTo(item.id, index);
      return;
    }

    multiSelectionFuncs.toggleSelection(item.id);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <StyledItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $itemState={itemState}
          $isDropAble={dragState.isDropAble}
          onClick={onClick}
          onKeyDown={(event) => onKeyDown(event, snapshot)}
        >
          {snapshot.isDragging && (
            <div className="selectedItemsCnt">
              <span className="a11y-hidden">선택한 아이템 수</span>
              {dragState.selectedItemsCnt}
            </div>
          )}
          {item.content}
        </StyledItem>
      )}
    </Draggable>
  );
}
