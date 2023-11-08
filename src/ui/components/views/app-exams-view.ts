import { loadComponent } from '../../utils/registry.js';
import AppTable from '../app-table/app-table.js';

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
    if (this.shouldComponentRender()) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = [stylesheet]; // Apply the stylesheet to the shadow root
      shadow.innerHTML = this.render();
      this.loadChildComponents();
      document.body.addEventListener(
        'eb-examsData',
        this.handleExamsData as EventListener
      );
      document.body.addEventListener(
        'eb-examResults',
        this.handleExamByIdResultsData as EventListener
      );
    }
  }

  disconnectedCallback(): void {
    document.body.removeEventListener(
      'eb-examsData',
      this.handleExamsData as EventListener
    );
    document.body.removeEventListener(
      'eb-examResults',
      this.handleExamByIdResultsData as EventListener
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
    const columnDefinitions = [
      { key: 'id', label: 'Exam ID' },
      { key: 'studentCount', label: 'Students' },
      { key: 'average', label: 'Avg Exam Grade' },
    ];

    if (!this.shadowRoot) return;
    const appTable = this.shadowRoot.querySelector('app-table') as AppTable;
    if (appTable) {
      appTable.setTableExamsData(
        columnDefinitions,
        event.detail.exams,
        item => {
          this.dispatchEvent(
            new CustomEvent('requestExamResultsById', {
              detail: { examId: item.id },
              bubbles: true,
              composed: true,
            })
          );
        }
      );
    }
  };

  /**
   * Obtain ranks by sorting student grades.
   * Table is unsorted but we will need to associate the student to their rank by grade
   *
   * @param event
   * @returns
   */
  private handleExamByIdResultsData = (
    event: CustomEvent<ExamResultDetail>
  ) => {
    const columnDefinitions = [
      { key: 'studentId', label: 'Student Name' },
      { key: 'score', label: 'Grade' },
      { key: 'rank', label: 'Rank' },
    ];

    if (!this.shadowRoot) return;
    const appTable = this.shadowRoot.querySelector('app-table') as AppTable;
    if (appTable) {
      appTable.setTableExamByIdData(
        columnDefinitions,
        event.detail.results,
        item => console.info(item)
      );
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

const stylesheet = new CSSStyleSheet();

stylesheet.replaceSync(/* inline-css */ `
    :host { flex: 1; }
   .container {
      display: flex;
      flex: 1;
      min-height: 400px;
      align-items: stretch;
      margin: 0 auto;
      background-color: rgb(232 232 232 / var(--bg-opacity))!important;
    }
    .content {
      height: 60vh;
      margin: 0;
      width: 100%;
    }

    .sidebar {
      height: 100%;
      margin: auto 0;
      flex: 1;
      align-items: center;
    }
`);
