import type { Columns, ItemType, Items, SelectedItems } from "@/DragDrop/model";

const columns: Columns[] = ["No Status", "Todo", "In Progress", "Done"];

const getItems = (count: number): ItemType[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    content: `item ${index + 1}`,
  }));

const items: Items = {
  "No Status": getItems(10),
  Todo: [],
  "In Progress": [],
  Done: [],
};

const initialSelectedItems: SelectedItems = {
  currItem: "",
  selectedItemsId: new Set(),
};

export { columns, items, initialSelectedItems };
