type Columns = "Todo" | "In Progress" | "Done" | "No Status";

type ItemType = {
  id: string;
  content: string;
};

type Items = { [key in Columns]: ItemType[] };

type SelectedItems = {
  currItem: string;
  selectedItemsId: Set<string>;
};

type ItemState = "current" | "selectionGroup" | "draggingGroup" | "default";

type MultiSelectionFuncs = {
  toggleSelectionInGroup: (itemId: string) => void;
  multiSelectTo: (itemId: string, itemIndex: number) => void;
  toggleSelection: (itemId: string) => void;
};

export type {
  ItemType,
  Items,
  Columns,
  SelectedItems,
  ItemState,
  MultiSelectionFuncs,
};
