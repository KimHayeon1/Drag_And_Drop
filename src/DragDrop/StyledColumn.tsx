import styled from "styled-components";

const StyledColumn = styled.ul<{ $isDraggingOver: boolean }>`
  --grid: 8;

  background: ${({ $isDraggingOver }) =>
    $isDraggingOver ? "lightblue" : "lightgrey"};
  padding: var(--grid);
  width: 250px;
`;

const StyledItem = styled.li<{ $isDragging: boolean }>`
  user-select: "none";
  padding: var(--grid) * 2;
  margin: 0 0 calc(var(--grid) * 1px) 0;
  background: ${({ $isDragging }) => ($isDragging ? "lightgreen" : "grey")};
`;

export { StyledColumn, StyledItem };
