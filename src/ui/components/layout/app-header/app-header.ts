const stylesheet = new CSSStyleSheet();
// stylesheet.replaceSync(`.navbar { /** */ }`);

// Placeholder component. It is neither a consumer or producer of events
export default class AppHeader extends HTMLElement {
  adoptedStyleSheets: readonly CSSStyleSheet[];
  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <nav class="navbar">
        <div class="container">
          <div class="nav-title">
            App Logo
          </div>
        </div>
      </nav>
    `;
  }
}
