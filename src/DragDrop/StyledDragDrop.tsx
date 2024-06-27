import styled, { css } from "styled-components";

import { ItemState } from "@/DragDrop/model";

const StyledMain = styled.main`
  --grid: 8px;

  padding: 0 calc(var(--grid) * 3) calc(var(--grid) * 3);

  h1 {
    margin: calc(var(--grid) * 5) 0 calc(var(--grid) * 4);
    text-align: center;
    font-size: var(--title-m);
  }
`;

const StyledWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--grid) * 2);
`;

const StyledColumn = styled.section<{ $isDraggingOver: boolean }>`
  padding: var(--grid);
  width: calc((100% - var(--grid) * 6) / 4);
  flex-grow: 1;
  background: ${({ $isDraggingOver }) => ($isDraggingOver ? "#bbb" : "#ddd")};
  color: #111;
  text-align: center;

  h2 {
    margin: calc(var(--grid) * 1.5) 0;
    font-size: var(--title-s);
  }

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
  position: relative;
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

  .selectedItemsCnt {
    position: absolute;
    right: -16px;
    top: -16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    font-size: var(--title-s);

    aspect-ratio: 1/1;
    font-weight: 700;
    border-radius: 50%;
    background: blue;
    color: white;
  }
`;

export { StyledMain, StyledWrap, StyledColumn, StyledItem };
