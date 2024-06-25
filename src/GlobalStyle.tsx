import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  button {
    padding: 0;
    border: none;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
    color: inherit;
    background-color: inherit;
  }

  ul {
    list-style: none;
  }
`;

export default GlobalStyle;
