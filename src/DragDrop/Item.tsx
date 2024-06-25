import { StyledItem } from "@/DragDrop/StyledDragDrop";
import { ItemType } from "@/DragDrop/model";
import { Draggable } from "react-beautiful-dnd";

export default function Item({
  item,
  index,
}: {
  item: ItemType;
  index: number;
}) {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <StyledItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
          $isDropAble={item.isDropAble}
        >
          {item.content}
        </StyledItem>
      )}
    </Draggable>
  );
}
