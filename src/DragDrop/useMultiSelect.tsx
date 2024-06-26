import { useState } from "react";
import { DragStart } from "react-beautiful-dnd";

import { initialSelectedItems } from "@/DragDrop/data";

import type { Columns, ItemType, Items, SelectedItems } from "@/DragDrop/model";

const getMultiSelectionItems = (
  start: number,
  end: number,
  columnItems: ItemType[],
) => {
  return columnItems
    .filter((_, i) => start <= i && i <= end)
    .map(({ id }) => id);
};

export default function useMultiSelect(items: Items) {
  const [selectedItems, setSelectedItems] =
    useState<SelectedItems>(initialSelectedItems);

  const setSelectedItemsToCurrentItem = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    setSelectedItems({
      multiSelection: {
        column,
        start: itemIndex,
      },
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

  const toggleSelectionInGroup = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    const newSelectedItemsId = new Set(selectedItems.selectedItemsId);
    const isPrevSelected = selectedItems.selectedItemsId.has(itemId);

    if (isPrevSelected) {
      newSelectedItemsId.delete(itemId);
    } else {
      newSelectedItemsId.add(itemId);
    }

    setSelectedItems({
      multiSelection: {
        column,
        start: itemIndex,
      },
      selectedItemsId: newSelectedItemsId,
    });
  };

  const multiSelectTo = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    if (column !== selectedItems.multiSelection.column) {
      return;
    }

    const hasSelectedItems = selectedItems.selectedItemsId.size > 1;

    if (hasSelectedItems) {
      setSelectedItemsToCurrentItem(itemId, itemIndex, column);
      return;
    }

    let multiSelectionItems;
    let nonConsecutiveItems;
    const {
      multiSelection: { start },
    } = selectedItems;

    if (start < itemIndex) {
      nonConsecutiveItems = getNonConsecutiveItems(
        start,
        itemIndex,
        items[column],
      );
      multiSelectionItems = getMultiSelectionItems(
        start,
        itemIndex,
        items[column],
      );
    } else {
      nonConsecutiveItems = getNonConsecutiveItems(
        itemIndex,
        start,
        items[column],
      );

      multiSelectionItems = getMultiSelectionItems(
        itemIndex,
        start,
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

  const toggleSelection = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    const hasSelectedItems = selectedItems.selectedItemsId.size > 1;

    if (hasSelectedItems) {
      setSelectedItemsToCurrentItem(itemId, itemIndex, column);
      return;
    }

    const isPrevSelected = selectedItems.selectedItemsId.has(itemId);

    if (isPrevSelected) {
      setSelectedItems(initialSelectedItems);
    } else {
      setSelectedItemsToCurrentItem(itemId, itemIndex, column);
    }
  };

  const addItemInSelectionGroup = ({ source }: DragStart) => {
    const column = source.droppableId as Columns;
    const id = items[column][source.index].id;

    setSelectedItems(({ selectedItemsId }) => ({
      multiSelection: {
        column,
        start: source.index,
      },
      selectedItemsId: new Set(
        selectedItemsId.size <= 1 ? [id] : [...selectedItemsId, id],
      ),
    }));
  };

  return {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    addItemInSelectionGroup,
  };
}
