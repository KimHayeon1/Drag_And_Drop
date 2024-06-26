import type { Columns, ItemType, Items, SelectedItems } from "@/DragDrop/model";

const columns: Columns[] = ["column1", "column2", "column3", "column4"];

const getItems = (count: number, column: Columns): ItemType[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    content: `item ${index}`,
    column,
    isDropAble: true,
  }));

const items: Items = {
  column1: getItems(10, "column1"),
  column2: [],
  column3: [],
  column4: [],
};

const initialSelectedItems: SelectedItems = {
  multiSelection: {
    column: null,
    start: -1,
  },
  selectedItemsId: new Set(),
};

export { columns, items, initialSelectedItems };
