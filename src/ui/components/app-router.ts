import { RouterHandler } from '../router/router.js'; // Adjust the path as necessary

/**
 * AppRouter custom element class.
 * Listens for router path change events and decides which component to display.
 *
 * Handles the 'router-update' event to refresh the DOM view.
 * This event should be dispatched when a navigation action requires
 * the view component to update its content based on the current route.
 *
 * @event
 * @name router-update
 * @type {CustomEvent}
 *
 */
export default class AppRouter extends HTMLElement {
  private routerHandler: RouterHandler;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const routes = [
      {
        name: 'app-exams-view',
        path: '/static/js/components/views/app-exams-view.js',
        regExp: new RegExp(/^#\/(exams)?$/), // RegExp to match both hash routes: "#/" and "#/exams"
      },
      {
        name: 'app-students-view',
        path: '/static/js/components/views/app-students-view.js',
        regExp: new RegExp(/^#\/students/),
      },
    ];
    this.routerHandler = new RouterHandler(routes);
    this.updateContent = this.updateContent.bind(this);
  }

  connectedCallback() {
    // Initialize the router when the component is added to the DOM
    this.routerHandler.initialize();
    document.addEventListener(
      'router-update',
      this.updateContent as EventListener
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      'router-update',
      this.updateContent as EventListener
    );
  }

  updateContent(event: CustomEvent<{ component: HTMLElement }>): void {
    // Ensure shadowRoot exists before trying to modify it
    if (!this.shadowRoot) return;

    // Clear current content
    this.shadowRoot.innerHTML = '';

    // Add the new component
    this.shadowRoot.appendChild(event.detail.component);
  }
}
