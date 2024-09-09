import { createItem } from "@/DragDrop/data";

describe("createItem", () => {
  it("should create an item", () => {
    const content = "Sample content";
    const item = createItem(content);

    expect(item.content).toEqual(content);
  });
});
