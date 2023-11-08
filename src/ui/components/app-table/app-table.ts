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
  setTableData(
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

  static get observedAttributes(): string[] {
    return ['data-type'];
  }

  //   attributeChangedCallback(
  //     name: string,
  //     oldValue: string | null,
  //     newValue: string | null
  //   ): void {
  //     if (name === 'data-type' && oldValue !== newValue) {
  //       this.fetchAndRenderData(newValue);
  //     }
  //   }

  connectedCallback(): void {
    this.shadow.innerHTML = '<p>Loading...</p>';
    this.render();
  }

  //   fetchAndRenderData(type: string | null): void {
  //     // Implement data fetching based on 'type' and then call setTableData
  //   }

  render(): void {
    console.log('items', this.items);
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
      <style>
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #ddd; cursor: pointer; }
      </style>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${tableContent}</tbody>
      </table>
    `;

    this.shadow.innerHTML = table;

    // After the innerHTML has been set, we can now query and add the event listeners
    const rows = this.shadow.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      row.addEventListener('click', () => this.onRowClick(this.items[index]));
    });
  }
}
