import { loadComponent } from '../../utils/registry.js';

const stylesheet = new CSSStyleSheet();
// stylesheet.replaceSync(`.navbar { /** */ }`);

// Placeholder component. It is neither a consumer or producer of events
export default class AppStudentsView extends HTMLElement {
  private childComponentsPromise?: Promise<void[]>;
  adoptedStyleSheets: readonly CSSStyleSheet[];
  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    if (this.shouldComponentRender()) {
      shadow.innerHTML = this.render();
      shadow.adoptedStyleSheets = [stylesheet];
      this.loadChildComponents();
    }
  }

  /**
   * Evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRender(): boolean {
    return !this.innerHTML;
  }

  async loadChildComponents() {
    if (!this.childComponentsPromise) {
      const componentsToLoad = [
        await loadComponent(
          'app-view-toggle',
          '/static/js/components/app-view-toggle/app-view-toggle.js'
        ),
      ];
      this.childComponentsPromise = Promise.all(componentsToLoad);
    }
    await this.childComponentsPromise;
  }

  render(): string {
    const template = /* html */ `
        <div class="students-page">
            <aside class="sidebar">
                <app-view-toggle></app-view-toggle>
            </aside>
            <div class="content">
                <!-- Other content specific to students view -->
            </div>
        </div>
    `;
    return template;
  }
}
