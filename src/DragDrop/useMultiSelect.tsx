import { useEffect, useState } from "react";
import { DragStart } from "react-beautiful-dnd";

import { columns, initialSelectedItems } from "@/DragDrop/data";

import type {
  Columns,
  ItemType,
  Items,
  MultiSelectByKeybord,
  MultiSelectTo,
  SelectedItems,
  ToggleSelection,
  ToggleSelectionByKeybord,
  ToggleSelectionInGroup,
} from "@/DragDrop/model";

const getMultiSelectionItems = (
  start: number,
  end: number,
  columnItems: readonly ItemType[],
) => {
  return columnItems
    .filter((_, i) => start <= i && i <= end)
    .map(({ id }) => id);
};

export default function useMultiSelect(items: Items) {
  const [selectedItems, setSelectedItems] =
    useState<SelectedItems>(initialSelectedItems);

  useEffect(() => {
    const deselectAll = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      if (!e.target.closest("li")) {
        setSelectedItems(initialSelectedItems);
      }
    };

    document.addEventListener("mousedown", deselectAll);

    return () => {
      document.removeEventListener("mousedown", deselectAll);
    };
  }, []);

  const findItemColumn = (itemId: string) => {
    const column = columns.find((column) =>
      items[column].map(({ id }) => id).includes(itemId),
    );

    if (!column) {
      console.error("유효하지 않은 id입니다.");
    }

    return column;
  };

  const findItemIndex = (itemId: string, column: Columns) => {
    const index = items[column].findIndex(({ id }) => id === itemId);

    if (index === -1) {
      console.error("유효하지 않은 id입니다.");
    }

    return index;
  };

  const setSelectedItemsToCurrentItem = (itemId: string) => {
    setSelectedItems({
      currItem: itemId,
      selectedItemsId: new Set([itemId]),
    });
  };

  const getNonConsecutiveItems = (
    start: number,
    end: number,
    columnItems: ItemType[],
  ) => {
    const nonConsecutiveItems = new Set(selectedItems.selectedItemsId);

    for (let i = start; i >= 0; i--) {
      const { id } = columnItems[i];

      if (nonConsecutiveItems.has(id)) {
        nonConsecutiveItems.delete(id);
      } else {
        break;
      }
    }

    for (let i = end; i < columnItems.length; i++) {
      const { id } = columnItems[i];

      if (nonConsecutiveItems.has(id)) {
        nonConsecutiveItems.delete(id);
      } else {
        break;
      }
    }

    return nonConsecutiveItems;
  };

  const toggleSelectionInGroup: ToggleSelectionInGroup = (itemId: string) => {
    const newSelectedItemsId = new Set(selectedItems.selectedItemsId);
    const isPrevSelected = selectedItems.selectedItemsId.has(itemId);

    if (isPrevSelected) {
      newSelectedItemsId.delete(itemId);
    } else {
      newSelectedItemsId.add(itemId);
    }

    setSelectedItems({
      currItem: itemId,
      selectedItemsId: newSelectedItemsId,
    });
  };

  const multiSelectTo: MultiSelectTo = (itemId: string, itemIndex: number) => {
    if (!selectedItems.selectedItemsId.size) {
      setSelectedItemsToCurrentItem(itemId);
      return;
    }

    const columnForMultiSelect = findItemColumn(selectedItems.currItem);
    const column = findItemColumn(itemId);

    if (!columnForMultiSelect || !column) {
      return;
    }

    if (column !== columnForMultiSelect) {
      return;
    }

    let multiSelectionItems;
    let nonConsecutiveItems;
    const startIndexForMultiSelect = findItemIndex(
      selectedItems.currItem,
      columnForMultiSelect,
    );

    if (startIndexForMultiSelect < itemIndex) {
      nonConsecutiveItems = getNonConsecutiveItems(
        startIndexForMultiSelect,
        itemIndex,
        items[column],
      );
      multiSelectionItems = getMultiSelectionItems(
        startIndexForMultiSelect,
        itemIndex,
        items[column],
      );
    } else {
      nonConsecutiveItems = getNonConsecutiveItems(
        itemIndex,
        startIndexForMultiSelect,
        items[column],
      );

      multiSelectionItems = getMultiSelectionItems(
        itemIndex,
        startIndexForMultiSelect,
        items[column],
      );
    }

    setSelectedItems((prev) => ({
      ...prev,
      selectedItemsId: new Set([
        ...nonConsecutiveItems,
        ...multiSelectionItems,
      ]),
    }));
  };

  const toggleSelection: ToggleSelection = (itemId: string) => {
    const hasSelectedItems = selectedItems.selectedItemsId.size > 1;

    if (hasSelectedItems) {
      setSelectedItemsToCurrentItem(itemId);
      return;
    }

    const isPrevSelected = selectedItems.selectedItemsId.has(itemId);

    if (isPrevSelected) {
      setSelectedItems(initialSelectedItems);
    } else {
      setSelectedItemsToCurrentItem(itemId);
    }
  };

  const addItemInSelectionGroup = ({ source }: DragStart) => {
    const column = source.droppableId as Columns;
    const id = items[column][source.index].id;

    setSelectedItems(({ selectedItemsId }) => ({
      currItem: id,
      selectedItemsId: new Set(
        selectedItemsId.size <= 1 ? [id] : [...selectedItemsId, id],
      ),
    }));
  };

  const toggleSelectionByTab = (column: Columns, prevItemIndex: number) => {
    if (items[column].length !== prevItemIndex + 1) {
      const { id } = items[column][prevItemIndex + 1];
      setSelectedItemsToCurrentItem(id);
      return;
    }

    const columnIndex = columns.findIndex((v) => v === column);
    const nextColumn = columns[columnIndex + 1];

    if (nextColumn && items[nextColumn].length) {
      const { id } = items[nextColumn][0];
      setSelectedItemsToCurrentItem(id);
      return;
    }

    setSelectedItems(initialSelectedItems);
  };

  const toggleSelectionByShiftTab = (
    column: Columns,
    prevItemIndex: number,
  ) => {
    console.log(column, prevItemIndex);
    if (prevItemIndex !== 0) {
      const { id } = items[column][prevItemIndex - 1];
      setSelectedItemsToCurrentItem(id);
      return;
    }

    const columnIndex = columns.findIndex((v) => v === column);
    const prevColumn = columns[columnIndex - 1];

    if (prevColumn && items[prevColumn].length) {
      const [{ id }] = items[prevColumn].slice(-1);
      setSelectedItemsToCurrentItem(id);
      return;
    }

    setSelectedItems(initialSelectedItems);
  };

  const toggleSelectionByArrowUp = (column: Columns, prevItemIndex: number) => {
    let id;

    if (prevItemIndex === 0) {
      id = items[column].slice(-1)[0].id;
    } else {
      id = items[column][prevItemIndex - 1].id;
    }
    setSelectedItemsToCurrentItem(id);
  };

  const toggleSelectionByArrowDown = (
    column: Columns,
    prevItemIndex: number,
  ) => {
    let id;

    if (items[column].length === prevItemIndex + 1) {
      id = items[column][0].id;
    } else {
      id = items[column][prevItemIndex + 1].id;
    }

    setSelectedItemsToCurrentItem(id);
  };

  const toggleSelectionByKeybord: ToggleSelectionByKeybord = (
    prevItemId: string,
    prevItemIndex: number,
    key: "ArrowUp" | "ArrowDown" | "Tab" | "Shift+Tab",
  ) => {
    const column = findItemColumn(prevItemId);

    if (!column) {
      return;
    }

    switch (key) {
      case "ArrowUp":
        toggleSelectionByArrowUp(column, prevItemIndex);
        break;
      case "ArrowDown":
        toggleSelectionByArrowDown(column, prevItemIndex);
        break;
      case "Tab":
        toggleSelectionByTab(column, prevItemIndex);
        break;
      case "Shift+Tab":
        toggleSelectionByShiftTab(column, prevItemIndex);
    }
  };

  const multiSelectByKeybord: MultiSelectByKeybord = (
    prevItemId: string,
    itemIndex: number,
  ) => {
    const column = findItemColumn(prevItemId);

    if (!column) {
      return;
    }

    // index 대신 keycod?
    const currIndex = findItemIndex(selectedItems.currItem, column);
    let newSelectedItemsId: Set<string>;

    if (currIndex < itemIndex) {
      newSelectedItemsId = new Set(
        items[column].slice(currIndex, itemIndex + 1).map(({ id }) => id),
      );
    } else {
      newSelectedItemsId = new Set(
        items[column].slice(itemIndex, currIndex + 1).map(({ id }) => id),
      );
    }

    setSelectedItems((prev) => ({
      ...prev,
      selectedItemsId: newSelectedItemsId,
    }));
  };

  return {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    addItemInSelectionGroup,
    toggleSelectionByKeybord,
    multiSelectByKeybord,
  };
}
