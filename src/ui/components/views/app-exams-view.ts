import { loadComponent } from '../../utils/registry.js';
import AppTable from '../app-table/app-table.js';

/**
 * AppExamsView custom element class - Event Producer
 *
 * Renders the Exams view UI and handles exam data events.
 *
 * Fetches and displays the list of exams. Allows drilling down into
 * a specific exam's results.
 *
 * Emits fetch event handled by app-events (Event Broker)
 * - requestExamResultsById - Fetches data for exam provided an ID
 *
 * Listens for and handles the custom events:
 * - eb-examsData - Renders the list of exams
 * - eb-examResults - Renders the table of results for a specific exam
 */
export default class AppExamsView extends HTMLElement {
  private childComponentsPromise?: Promise<void[]>;
  adoptedStyleSheets: readonly CSSStyleSheet[];
  // Store the average score
  private averageScore?: string;
  // Store the current exam ID, if applicable
  private examId?: number | string;
  constructor() {
    super();
    this.adoptedStyleSheets = [stylesheet];
    this.handleExamsData = this.handleExamsData.bind(this);
  }

  static get observedAttributes() {
    return ['exam-id'];
  }

  connectedCallback(): void {
    if (this.shouldComponentRender()) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = this.render();
      this.loadChildComponents();
      shadow.adoptedStyleSheets = [stylesheet]; // Apply the stylesheet to the shadow root
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

  // not using the slot
  render(): string {
    const template = /*html*/ `
        <div class="container">
            <aside class="sidebar">
                <app-view-toggle></app-view-toggle>
            </aside>
             <div class="content">
                <div id="content-heading">
                  <slot></slot>
                </div>
                <app-table></app-table>
            </div>
        </div>
    `;
    return template;
  }

  /**
   * Handles the eb-examsData event containing exam list data.
   * Sets the data on the app-table component to display the exams list.
   * Registers a click handler on each row to fetch and display exam result details.
   */
  private handleExamsData = (event: CustomEvent<ExamsEventDetail>) => {
    const columnDefinitions = [
      { key: 'id', label: 'Exam ID' },
      { key: 'average', label: 'Avg Exam Grade' },
      { key: 'studentCount', label: 'Students' },
    ];

    if (!this.shadowRoot) return;
    const appTable = this.shadowRoot.querySelector('app-table') as AppTable;
    const dov = this.shadowRoot?.querySelector(
      '#content-heading'
    ) as HTMLDivElement;
    dov.innerHTML = '';
    dov.innerHTML = `<h3>All Exams</h3>`;
    if (appTable) {
      appTable.setTableExamsData(
        columnDefinitions,
        event.detail.exams,
        (item: ExamData) => {
          this.examId = item.id;
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
    this.averageScore = (event.detail.average * 100).toFixed(2) + '%';
    this.examId = event.detail.examId;

    const dov = this.shadowRoot?.querySelector(
      '#content-heading'
    ) as HTMLDivElement;
    dov.innerHTML = '';
    dov.innerHTML = `<h3>Exam ${this.examId}</h3><span>Average ${this.averageScore}</span>`;

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
  private async loadChildComponents(): Promise<void> {
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
      margin: 0 0 100px 0;
      width: 100%;
    }

    #content-heading > span {
      font-size: small;
      color: var(--dark-grey);
    }
    #content-heading h3 {
      margin: 0.5em 0;
    }

    .sidebar {
      height: 100%;
      margin: auto 0;
      flex: 1;
      align-items: center;
    }
`);
