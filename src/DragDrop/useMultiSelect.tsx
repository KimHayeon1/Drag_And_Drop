import { useState } from "react";
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

  const initializeSelectedItems = () => {
    setSelectedItems(initialSelectedItems);
  };

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

  const selectItem = (itemId: string) => {
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
      selectItem(itemId);
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
      selectItem(itemId);
      return;
    }

    const isPrevSelected = selectedItems.selectedItemsId.has(itemId);

    if (isPrevSelected) {
      initializeSelectedItems();
    } else {
      selectItem(itemId);
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

  const toggleSelectionByArrowUp = (column: Columns, prevItemIndex: number) => {
    let id;

    if (prevItemIndex === 0) {
      id = items[column].slice(-1)[0].id;
    } else {
      id = items[column][prevItemIndex - 1].id;
    }
    selectItem(id);
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

    selectItem(id);
  };

  const toggleSelectionByKeybord: ToggleSelectionByKeybord = (
    prevItemId: string,
    prevItemIndex: number,
    key: "ArrowUp" | "ArrowDown",
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
    selectItem,
    initializeSelectedItems,
  };
}
