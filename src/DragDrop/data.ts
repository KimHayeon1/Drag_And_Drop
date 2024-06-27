import type { Columns, ItemType, Items, SelectedItems } from "@/DragDrop/model";

const columns: Columns[] = ["column1", "column2", "column3", "column4"];

const getItems = (count: number): ItemType[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    content: `item ${index + 1}`,
  }));

const items: Items = {
  column1: getItems(10),
  column2: [],
  column3: [],
  column4: [],
};

const initialSelectedItems: SelectedItems = {
  currItem: "",
  selectedItemsId: new Set(),
};

export { columns, items, initialSelectedItems };
