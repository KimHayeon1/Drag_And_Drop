import { useState } from "react";

import type { Columns, Items, SelectedItems } from "@/DragDrop/model";

export default function useMultiSelect(items: Items) {
  const [selectedItems, setSelectedItems] = useState<SelectedItems>(null);

  const toggleSelectionInGroup = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    if (!selectedItems) {
      setSelectedItems({
        multiSelection: {
          column,
          startItem: itemIndex,
        },
        selectedItemsId: new Set([itemId]),
      });
      return;
    }

    const newselectedItemsId = new Set(selectedItems.selectedItemsId);

    if (selectedItems.selectedItemsId.has(itemId)) {
      newselectedItemsId.delete(itemId);
    } else {
      newselectedItemsId.add(itemId);
    }

    const newSelectedItems = {
      multiSelection: {
        column,
        startItem: itemIndex,
      },
      selectedItemsId: newselectedItemsId,
    };
    setSelectedItems(newSelectedItems);
  };

  const multiSelectTo = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    if (!selectedItems) {
      setSelectedItems({
        multiSelection: {
          column,
          startItem: itemIndex,
        },
        selectedItemsId: new Set([itemId]),
      });
      return;
    }

    if (column !== selectedItems.multiSelection.column) {
      return;
    }

    const startItemForMultiSelection = selectedItems.multiSelection.startItem;
    const selectedItemsId = selectedItems.selectedItemsId;
    let newselectedItemsId;
    const nonConsecutiveSelectedItems = new Set(selectedItemsId);

    if (startItemForMultiSelection < itemIndex) {
      for (let i = itemIndex; i < items[column].length; i++) {
        if (nonConsecutiveSelectedItems.has(items[column][i].id)) {
          nonConsecutiveSelectedItems.delete(items[column][i].id);
        } else {
          break;
        }
      }

      for (let i = startItemForMultiSelection; i >= 0; i--) {
        if (nonConsecutiveSelectedItems.has(items[column][i].id)) {
          nonConsecutiveSelectedItems.delete(items[column][i].id);
        } else {
          break;
        }
      }

      newselectedItemsId = items[column]
        .filter(
          (_, index) =>
            index >= startItemForMultiSelection && index <= itemIndex,
        )
        .map(({ id }) => id);
    } else {
      for (let i = startItemForMultiSelection; i < items[column].length; i++) {
        if (nonConsecutiveSelectedItems.has(items[column][i].id)) {
          nonConsecutiveSelectedItems.delete(items[column][i].id);
        } else {
          break;
        }
      }

      for (let i = itemIndex; i >= 0; i--) {
        if (nonConsecutiveSelectedItems.has(items[column][i].id)) {
          nonConsecutiveSelectedItems.delete(items[column][i].id);
        } else {
          break;
        }
      }

      newselectedItemsId = items[column]
        .filter(
          (_, index) =>
            index <= startItemForMultiSelection && index >= itemIndex,
        )
        .map(({ id }) => id);
    }

    setSelectedItems({
      multiSelection: {
        column,
        startItem: startItemForMultiSelection,
      },
      selectedItemsId: new Set([
        ...nonConsecutiveSelectedItems,
        ...newselectedItemsId,
      ]),
    });
  };

  const toggleSelection = (
    itemId: string,
    itemIndex: number,
    column: Columns,
  ) => {
    if (
      selectedItems?.selectedItemsId.size === 1 &&
      selectedItems?.selectedItemsId.has(itemId)
    ) {
      setSelectedItems(null);
    } else {
      setSelectedItems({
        multiSelection: {
          column,
          startItem: itemIndex,
        },
        selectedItemsId: new Set([itemId]),
      });
    }
  };

  return {
    selectedItems,
    toggleSelectionInGroup,
    multiSelectTo,
    toggleSelection,
  };
}
