import styled from "styled-components";

const StyledWrap = styled.div`
  --grid: 8px;

  padding: calc(var(--grid) * 3);
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--grid) * 2);
  width: 100vw;
`;

const StyledColumn = styled.ul<{ $isDraggingOver: boolean }>`
  padding: var(--grid);
  width: calc((100% - var(--grid) * 6) / 4);
  flex-grow: 1;
  background: ${({ $isDraggingOver }) =>
    $isDraggingOver ? "lightblue" : "black"};
  color: white;

  @media (max-width: 768px) {
    width: calc((100% - var(--grid) * 2) / 2);
  }

  @media (max-width: 430px) {
    width: 100%;
  }
`;

const StyledItem = styled.li<{
  $isDragging: boolean;
  $isDropAble: boolean;
  $isSelected: boolean;
}>`
  padding: calc(var(--grid) * 2);
  background: ${({ $isDragging }) => ($isDragging ? "blue" : "white")};
  background: ${({ $isDropAble }) => (!$isDropAble ? "red" : "")};
  background: ${({ $isSelected }) => ($isSelected ? "blue" : "")};
  color: black;
  user-select: "none";

  & + & {
    margin: var(--grid) 0 0;
  }

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "blue" : "skyblue")};
  }
`;

export { StyledWrap, StyledColumn, StyledItem };
