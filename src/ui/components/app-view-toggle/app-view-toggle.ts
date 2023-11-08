import { App } from '../../index.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(/* css */ `
  .wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  background: #33CCFF;
  border-radius: 10px;
  border: 1px solid #1fb8eb;
}

.nav-item {
  flex: 1; /* Each item will take equal space */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.nav-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  color: #333;
  width: 100%; /* Make link take full width of the item */
}

.nav-item p {
  margin: 0;
}
`);

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

      // Add event listeners directly to the links within the shadow root
      const examLink = shadow.getElementById('data-exam');
      const studentLink = shadow.getElementById('data-student');
      if (examLink) {
        examLink.addEventListener('click', this.clickListener);
      }
      if (studentLink) {
        studentLink.addEventListener('click', this.clickListener);
      }
    }
    console.group('view-toggle');
    console.info('slug', App.slug, 'urlending', App.urlEnding);
    console.groupEnd();
    const path = App.currentPath;
    console.log('current path', path);
    if (!this.initialized) {
      this.initialized = true;
      // Gonna leave this because I'm going in circles here
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

  disconnectedCallback(): void {
    // Remove event listeners from the links within the shadow root
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
    // Return the HTML template for the component
    return /* html */ `
     <div class="wrapper">
        <ul class="container">
            <li class="nav-item">
            <a id="data-exam" class="nav-link" href="#">
                <div class="circle">E</div>
                <p>Exams</p>
            </a>
            </li>
            <li class="nav-item">
            <a id="data-student" class="nav-link" href="#">
                <div class="circle">S</div>
                <p>Students</p>
            </a>
            </li>
        </ul>
    </div>
    `;
  }

  // We only need to render once
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
    let target = event.target;
    const navItem = target.closest('.nav-item');

    // If a `nav-item` was clicked, simulate a click on its child `a` tag
    if (navItem) {
      const link = navItem.querySelector('a') as HTMLAnchorElement;
      link.click();
    }

    event.preventDefault();
    console.log(event.target);

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
