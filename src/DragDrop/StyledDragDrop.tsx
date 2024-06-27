import styled, { css } from "styled-components";

import { ItemState } from "@/DragDrop/model";

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
  background: ${({ $isDraggingOver }) => ($isDraggingOver ? "#bbb" : "#ddd")};
  color: #111;
  text-align: center;

  @media (max-width: 768px) {
    width: calc((100% - var(--grid) * 2) / 2);
  }

  @media (max-width: 430px) {
    width: 100%;
  }
`;

const DraggingGroupStyle = css`
  background: #eee;
  color: #aaa;
  outline: none;
`;

const SelectionGroupStyle = css`
  outline: 1px solid blue;
  background: #ddddff;
`;

const CurrentStyle = css`
  outline: 2px solid blue;
  background: #ddddff;
`;

const DefaultStyle = css`
  &:hover,
  &:focus {
    outline: 1px solid #9999ff;
    background: #ddddff;
  }
`;

const disabledDropStyle = css`
  outline: 2px solid red;
  background: #ffdddd;
`;

const StyledItem = styled.li<{
  $itemState: ItemState;
  $isDropAble: boolean;
}>`
  padding: calc(var(--grid) * 2);
  text-align: left;
  background: #fff;
  user-select: "none";
  ${({ $itemState }) => $itemState === "draggingGroup" && DraggingGroupStyle}
  ${({ $itemState }) => $itemState === "selectionGroup" && SelectionGroupStyle}
  ${({ $itemState }) => $itemState === "current" && CurrentStyle}
  ${({ $itemState }) => $itemState === "default" && DefaultStyle}
  ${({ $isDropAble }) => !$isDropAble && disabledDropStyle}

  & + & {
    margin: var(--grid) 0 0;
  }
`;

export { StyledWrap, StyledColumn, StyledItem };
