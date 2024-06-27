import { useEffect, useState } from "react";
import { DragStart } from "react-beautiful-dnd";

import { columns, initialSelectedItems } from "@/DragDrop/data";

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

  const toggleSelectionInGroup = (itemId: string) => {
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

  const multiSelectTo = (itemId: string, itemIndex: number) => {
    if (!selectedItems.selectedItemsId.size) {
      setSelectedItemsToCurrentItem(itemId);
      return;
    }

    const columnForMultiSelect = columns.find((column) =>
      items[column].map(({ id }) => id).includes(selectedItems.currItem),
    );
    const column = columns.find((column) =>
      items[column].map(({ id }) => id).includes(itemId),
    );

    if (!columnForMultiSelect || !column) {
      console.error("유효하지 않은 아이템 id입니다.");
      return;
    }

    if (column !== columnForMultiSelect) {
      return;
    }

    let multiSelectionItems;
    let nonConsecutiveItems;
    const startIndexForMultiSelect = items[columnForMultiSelect].findIndex(
      ({ id }) => id === selectedItems.currItem,
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

  const toggleSelection = (itemId: string) => {
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

  return {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
    addItemInSelectionGroup,
  };
}
