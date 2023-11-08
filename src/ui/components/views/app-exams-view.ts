import { loadComponent } from '../../utils/registry.js';
import AppTable from '../app-table/app-table.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replaceSync(/* css */ `
    :host {
        flex: 1;
    }
   .container {
        display: flex;
        flex: 1;
        align-items: center;
        margin: 10px auto;
        padding: 0 15px;
    }

    .content {
        height: 60vh;
        overflow: scroll;
        margin: 0;
        width: 100%;
        background: green;
    }

    .sidebar {
        height: 100%;
        flex: 1;
        background: blue;
        align-items: center;
    }
`);
/**
 * AppExamsView custom element class.
 * Listens for router path change events and decides which component to display.
 */
export default class AppExamsView extends HTMLElement {
  private childComponentsPromise?: Promise<void[]>;
  adoptedStyleSheets: readonly CSSStyleSheet[];
  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
    this.handleExamsData = this.handleExamsData.bind(this);
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [stylesheet]; // Apply the stylesheet to the shadow root
    shadow.innerHTML = this.render();
    this.loadChildComponents();
    document.body.addEventListener(
      'eb-examsData',
      this.handleExamsData as EventListener
    );
  }

  disconnectedCallback(): void {
    document.body.removeEventListener(
      'eb-examsData',
      this.handleExamsData as EventListener
    );
  }

  /**
   * Evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRender(): boolean {
    return !this.shadowRoot?.hasChildNodes();
  }

  render(): string {
    const template = /*html*/ `
        <div class="container">
            <aside class="sidebar">
                <app-view-toggle></app-view-toggle>
            </aside>
             <div class="content">
                <app-table></app-table>
            </div>
        </div>
    `;
    return template;
  }

  private handleExamsData = (event: CustomEvent<ExamsEventDetail>) => {
    console.info(event);
    const columnDefinitions = [
      { key: 'id', label: 'Exam ID' },
      { key: 'studentCount', label: 'Students' },
      { key: 'average', label: 'Avg Exam Grade' },
    ];

    if (!this.shadowRoot) return;
    const appTable = this.shadowRoot.querySelector('app-table') as AppTable;
    if (appTable) {
      appTable.setTableData(columnDefinitions, event.detail.exams, item => {
        console.log('Row clicked', item);
      });
    }
  };

  /**
   * Fetch children when first needed and register them
   *
   * @returns {Promise<void>}
   */
  async loadChildComponents(): Promise<void> {
    if (!this.childComponentsPromise) {
      const componentsToLoad = [
        loadComponent(
          'app-view-toggle',
          '/static/js/components/app-view-toggle/app-view-toggle.js'
        ),
        loadComponent(
          'app-table',
          '/static/js/components/app-table/app-table.js'
        ),
      ];
      this.childComponentsPromise = Promise.all(componentsToLoad);
    }
    await this.childComponentsPromise;
  }
}
