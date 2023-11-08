import { App } from '../../index.js';

/**
 * AppView custom element class - Event Consumer.
 * Listens for router path change events and decides which component to display.
 */
export default class AppViewToggle extends HTMLElement {
  adoptedStyleSheets: readonly CSSStyleSheet[];
  private initialized = false;

  constructor() {
    super();

    // Bind the clickListener method to the instance
    this.clickListener = this.clickListener.bind(this);

    // Initialize the adopted stylesheets
    this.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback(): void {
    if (this.shouldComponentRender()) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = this.render();
      shadow.adoptedStyleSheets = [stylesheet];

      const examLink = shadow.getElementById('data-exam');
      const studentLink = shadow.getElementById('data-student');
      if (examLink) {
        examLink.addEventListener('click', this.clickListener);
      }
      if (studentLink) {
        studentLink.addEventListener('click', this.clickListener);
      }

      const path = App.currentPath;
      if (!this.initialized) {
        this.initialized = true;
        if (path === '/exams' || path === '' || path === '#/') {
          this.dispatchEvent(
            new CustomEvent('requestExamsData', {
              bubbles: true,
              composed: true,
            })
          );
        } else if (path === '/students') {
          this.dispatchEvent(
            new CustomEvent('requestStudentData', {
              bubbles: true,
              composed: true,
            })
          );
        }
      }
    }
  }

  disconnectedCallback(): void {
    const shadow = this.shadowRoot;
    if (shadow) {
      const examLink = shadow.getElementById('data-exam');
      const studentLink = shadow.getElementById('data-student');
      if (examLink) examLink.removeEventListener('click', this.clickListener);
      if (studentLink)
        studentLink.removeEventListener('click', this.clickListener);
    }
  }

  private render(): string {
    // Determine active state based on path
    const isActiveExam =
      App.currentPath === '/exams' ||
      App.currentPath === '' ||
      App.currentPath === '#/';
    const isActiveStudent = App.currentPath === '/students';

    return /* html */ `
   <div class="wrapper">
      <ul class="container">
          <li class="nav-item">
              <a id="data-exam" class="nav-link ${
                isActiveExam ? 'active' : ''
              }" href="#">
                  <div class="circle ${isActiveExam ? 'active' : ''}">E</div>
                  <p ${isActiveExam ? 'class="active"' : ''}>Exams</p>
              </a>
          </li>
          <li class="nav-item">
              <a id="data-student" class="nav-link ${
                isActiveStudent ? 'active' : ''
              }" href="#">
                  <div class="circle ${isActiveStudent ? 'active' : ''}">S</div>
                  <p ${isActiveStudent ? 'class="active"' : ''}>Students</p>
              </a>
          </li>
      </ul>
  </div>
  `;
  }

  private shouldComponentRender(): boolean {
    return !this.innerHTML;
  }

  /**
   * Handles click events on the component.
   * Dispatches custom events based on the clicked element's ID
   * to fetch data from the API.
   */
  private clickListener(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;
    // Find the closest `nav-item` ancestor from the clicked element
    let target = event.target as HTMLElement;
    const navItem = target.closest('.nav-item') as HTMLLIElement;

    if (navItem) {
      // Find the anchor within the nav-item
      const link = navItem.querySelector('a');
      if (link) {
        // Trigger a click on the anchor
        link.click();
        event.preventDefault();
      }
    }
    switch (event.target.id) {
      case 'data-exam':
        // Dispatch the custom event for the exams
        this.dispatchEvent(
          new CustomEvent('requestExamsData', {
            bubbles: true,
            composed: true,
          })
        );
        break;
      case 'data-student':
        // Dispatch the custom event for the students
        this.dispatchEvent(
          new CustomEvent('requestStudentsData', {
            bubbles: true,
            composed: true,
          })
        );
        break;
      default:
        console.error('CustomEvent not supported');
        break;
    }
  }
}

const stylesheet = new CSSStyleSheet();

// Having trouble separating styles from component definitions..
stylesheet.replaceSync(/* css */ `
    .wrapper {
      display: flex;
      flex-direction: column;
      height: calc(65vh - 5.23em);
      margin-right: 1.5em;
      margin-top: 1em;
    }
    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
      list-style-type: none;
      padding: 0;
      gap: 0.5em;
      margin: 0;
      border-radius: 10px;
    }
    .nav-item {
      flex: 1; /* Each item will take equal space */
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--middle-grey);
      border-radius: var(--border-radius-icon);
      transition: all .15s ease;
    }
    .circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--dark-grey);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-link {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: auto 0.75em;
      height: 100%;
      color: var(--dark-grey);
      width: 100%;
    }
    .nav-item p {
      margin: 0.25em 0;
      font-size: x-small;
    }
    /* Interactive styles */
    .nav-item:hover { background-color: var(--hover-bg-active);}
    .nav-item:hover .circle {
      background-color: var(--hover-color-active);
    }
    .nav-item:hover .nav-link,
    .nav-item:hover .nav-link p {
      color: var(--hover-color-active);
    }
    /* Selected tab styles */
    .nav-item .circle.active {
      background-color: var(--hover-color-active);
    }
    .nav-item p.active { color: var(--hover-color-active);}
`);
