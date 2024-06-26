import styled from "styled-components";

const StyledWrap = styled.div`
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100vw;
`;

const StyledColumn = styled.ul<{ $isDraggingOver: boolean }>`
  --grid: 8;

  padding: var(--grid);
  width: calc((100% - 16px * 3) / 4);
  min-width: 250px;
  flex-grow: 1;
  background: ${({ $isDraggingOver }) =>
    $isDraggingOver ? "lightblue" : "black"};
  color: white;
`;

const StyledItem = styled.li<{
  $isDragging: boolean;
  $isDropAble: boolean;
  $isSelected: boolean;
}>`
  padding: calc(var(--grid) * 2px);
  background: ${({ $isDragging, $isDropAble }) =>
    !$isDropAble ? "red" : $isDragging ? "lightgreen" : "white"};
  background: ${({ $isSelected }) => ($isSelected ? "blue" : "")};
  color: black;
  user-select: "none";

  & + & {
    margin: calc(var(--grid) * 1px) 0 0;
  }
`;

export { StyledWrap, StyledColumn, StyledItem };
