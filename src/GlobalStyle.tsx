import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    font-size: 62.5%;
    --text-l: 1.6rem;
    --title-s: 2rem;
  }

  body {
    margin: 0;
    font-size: var(--text-l);
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
    margin: 0;
    list-style: none;
  }


  .a11y-hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }
`;

export default GlobalStyle;
