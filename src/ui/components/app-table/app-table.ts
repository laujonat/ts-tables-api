/**
 * AppTable custom element class - Event Consumer
 *
 * Renders tabular data with column headers.
 * Allows clicking on rows to trigger a callback.
 *
 * Provides methods to set the table data for exams or exam results.
 * Handles sorting, ranking, and formatting the exam result data.
 */
export default class AppTable extends HTMLElement {
  private shadow: ShadowRoot;
  private columns: Array<{ key: string; label: string }>;
  private items: ExamData[];
  private onRowClick: (item: any) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.columns = []; // Columns definitions
    this.items = []; // Items data
    this.onRowClick = () => {}; // Placeholder function
  }
  setTableExamsData(
    columns: Array<{ key: string; label: string }>,
    items: any[], // Type corrected to any array
    onRowClick: (item: any) => void
  ): void {
    this.columns = columns;
    this.items = items.map(item => ({
      ...item,
      average: (item.average * 100).toFixed(2) + '%',
    }));
    this.onRowClick = onRowClick;
    this.render();
  }

  /**
   * Sets the table data for a specific exam results, sorting and ranking students.
   *
   * @param columns - Column definitions for the table
   * @param items - Exam result data
   * @param onRowClick - Callback when a row is clicked
   */
  setTableExamByIdData(
    columns: Array<{ key: string; label: string }>,
    items: any[],
    onRowClick: (item: any) => void
  ): void {
    // Sort items by score in descending order
    const sortedItems = items
      .map((item, index) => ({ ...item, index })) // Keep the original index
      .sort((a, b) => b.score - a.score);

    // Assign ranks, handling ties
    let rank = 1;
    for (let i = 0; i < sortedItems.length; i++) {
      if (i > 0 && sortedItems[i].score < sortedItems[i - 1].score) {
        rank = i + 1;
      }
      sortedItems[i].rank = rank; // Assign the rank directly in the sorted array
    }

    // Reorder the array back to the original order using the stored index
    sortedItems.sort((a, b) => a.index - b.index);

    // Map to format the score and keep the rank
    this.items = sortedItems.map(item => ({
      ...item,
      score: (item.score * 100).toFixed(2) + '%',
    }));
    this.onRowClick = onRowClick;
    this.columns = columns;
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['data-type'];
  }

  connectedCallback(): void {
    this.shadow.innerHTML = '<p>Loading...</p>';
    this.render();
    this.shadow.adoptedStyleSheets = [stylesheet]; // Apply the stylesheet to the shadow root
  }

  render(): void {
    // console.log('items', this.items);
    const tableContent = this.items
      .map((item: any) => {
        return `<tr>${this.columns
          .map(column => {
            return `<td>${item[column.key]}</td>`;
          })
          .join('')}</tr>`;
      })
      .join('');

    const headers = this.columns
      .map(column => `<th>${column.label}</th>`)
      .join('');

    const table = /* html */ `
      <div class="fixed">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${tableContent}</tbody>
        </table>
      </div>
    `;

    this.shadow.innerHTML = table;

    // After the innerHTML has been set, we can now query and add the event listeners
    const rows = this.shadow.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      row.addEventListener('click', () => this.onRowClick(this.items[index]));
    });
  }
}

const stylesheet = new CSSStyleSheet();

stylesheet.replaceSync(/* inline-css */ `
  table {
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  font-size: small;
  margin: 0;
  min-width: 400px;
  width: 100%;
}

  th, td {
    // border: 1px solid var(--middle-grey);
    padding: 8px;
    text-align: left;
	cursor: pointer;
  }

  th {
    background-color: var(--lightest-grey);
  }

  .fixed {
    height: 100%;
    margin: 1em;
    overflow-y: auto;
  }

  .fixed thead th {
    background-color: inherit;
    position: sticky;
    top: 0;
    border-top: 1px solid var(--dark-grey);
    z-index: 1;
  }

  .fixed thead th:first-child {
    border-top-left-radius: var(--border-radius-main);
  }

  .fixed thead th:last-child {
    border-top-right-radius: var(--border-radius-main);
  }

  .fixed tbody tr:last-child td:first-child {
    border-bottom-left-radius: var(--border-radius-main);
  }

  .fixed tbody tr:last-child td:last-child {
    border-bottom-right-radius: var(--border-radius-main);
  }

  .fixed tbody tr:hover td, .fixed tbody tr:hover th {
    color: #1763fa;
    cursor: pointer;
  }

  .fixed thead tr {
    background-color: #f2f2f2;
  }

  .fixed th, .fixed td {
    background-color: var(--lightest-grey);
    border-bottom: 1px solid var(--dark-grey);
    border-right: 1px solid var(--dark-grey);
    padding: 8px;
    text-align: left;
  }
  .fixed th:first-child, .fixed td:first-child {
    border-left: 1px solid var(--dark-grey);
  }

  .fixed tbody tr:hover td {
    background-color: var(--hover-bg-active);
    color: var(--hover-color-active);
    cursor: pointer;
  }

  /* Ensure no hover effect for thead rows */
  .fixed thead tr:hover td, .fixed thead tr:hover th {
    background-color: inherit;
    color: inherit;
    cursor: default;
  }
`);
