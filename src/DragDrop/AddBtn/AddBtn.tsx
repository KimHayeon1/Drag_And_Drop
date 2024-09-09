import StyledAddBtn from "@/DragDrop/AddBtn/StyledAddBtn";

export default function AddBtn({ addItem }: { addItem: () => void }) {
  return (
    <StyledAddBtn id="add-btn" onClick={addItem}>
      아이템 추가
    </StyledAddBtn>
  );
}
