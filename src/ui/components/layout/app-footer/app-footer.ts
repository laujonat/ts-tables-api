const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(/* css */ `
    footer {
        padding: 1em;
        background-color: #f8f9fa;
        text-align: center;
        font-family: Arial, sans-serif;
    }

    .attribution {
        margin-top: 1em;
        font-size: 0.8em;
    }
`);

export default class AppFooter extends HTMLElement {
  adoptedStyleSheets: readonly CSSStyleSheet[];

  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
  }

  static get observedAttributes(): string[] {
    return [];
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = this.render();
    shadow.adoptedStyleSheets = [stylesheet];
  }

  render() {
    const template = /* html */ `
        <footer>
            <div class="container">
                <span class="attribution">
                    ❤️
                </span>
            </div>
        </footer>
    `;
    return template;
  }
}
