type Columns = "column1" | "column2" | "column3" | "column4";

type ItemType = {
  id: string;
  content: string;
  column: Columns;
  isDropAble: boolean;
};

type Items = { [key in Columns]: ItemType[] };

export type { ItemType, Items, Columns };
