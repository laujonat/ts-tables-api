// Placeholder component. It is neither a consumer or producer of events
export default class AppHeader extends HTMLElement {
  adoptedStyleSheets: readonly CSSStyleSheet[];
  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = this.render();
    shadow.adoptedStyleSheets = [stylesheet];
  }

  render() {
    const template = /* html */ `
      <nav class="navbar">
        <div class="container">
          <div class="nav-title">
            <div class="circle">LD</div>
          </div>
        </div>
      </nav>
    `;
    return template;
  }
}
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(/* inline-css */ `
    .navbar {
      position: relative;
      background-color: var(--dark-grey);
      border-radius: var(--border-radius-main) var(--border-radius-main) 0 0;
      padding: 1rem;
      top: 0;
      transition: all 250ms;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }

    .navbar::after {
      content: "";
      display: table;
      clear: both;
    }
    .navbar > .nav-title {
      display: inline-block;
      font-size: large;
      padding: 10px 10px 10px 10px;
    }
     .circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--middle-grey);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar {
      height: 100%;
      margin: auto 0;
      flex: 1;
      align-items: center;
    }

`);
