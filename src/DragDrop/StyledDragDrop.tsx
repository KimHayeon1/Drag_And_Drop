import styled from "styled-components";

const StyledWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
`;

const StyledColumn = styled.ul<{ $isDraggingOver: boolean }>`
  --grid: 8;

  padding: var(--grid);
  width: 25%;
  min-width: 250px;
  flex-grow: 1;
  background: ${({ $isDraggingOver }) =>
    $isDraggingOver ? "lightblue" : "lightgrey"};
`;

const StyledItem = styled.li<{ $isDragging: boolean }>`
  margin: 0 0 calc(var(--grid) * 1px) 0;
  padding: var(--grid) * 2;
  background: ${({ $isDragging }) => ($isDragging ? "lightgreen" : "grey")};
  user-select: "none";
`;

export { StyledWrap, StyledColumn, StyledItem };
