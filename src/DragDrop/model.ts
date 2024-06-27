type Columns = "column1" | "column2" | "column3" | "column4";

type ItemType = {
  id: string;
  content: string;
  column: Columns;
  isDropAble: boolean;
};

type Items = { [key in Columns]: ItemType[] };

type SelectedItems = {
  startItemForMultiSelect: string;
  selectedItemsId: Set<string>;
};

type ItemState = "current" | "selectionGroup" | "draggingGroup" | "default";

export type { ItemType, Items, Columns, SelectedItems, ItemState };
