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

type ToggleSelectionInGroup = (itemId: string) => void;
type MultiSelectTo = (itemId: string, itemIndex: number) => void;
type ToggleSelection = (itemId: string) => void;
type ToggleSelectionByKeybord = (
  prevItemId: string,
  prevItemIndex: number,
  key: "ArrowUp" | "ArrowDown" | "Tab" | "Shift+Tab",
) => void;
type MultiSelectByKeybord = (itemId: string, itemIndex: number) => void;

type MultiSelectionFuncs = {
  toggleSelectionInGroup: ToggleSelectionInGroup;
  multiSelectTo: MultiSelectTo;
  toggleSelection: ToggleSelection;
  toggleSelectionByKeybord: ToggleSelectionByKeybord;
  multiSelectByKeybord: MultiSelectByKeybord;
};

export type {
  ItemType,
  Items,
  Columns,
  SelectedItems,
  ItemState,
  MultiSelectionFuncs,
  ToggleSelectionInGroup,
  MultiSelectTo,
  ToggleSelection,
  ToggleSelectionByKeybord,
  MultiSelectByKeybord,
};
