type Route = {
  name: string;
  path: string;
  regExp: RegExp;
  component?: HTMLElement;
};

/**
 * RouterHandler handles client-side routing by mapping URL hash changes to components.
 * It loads components dynamically when needed and updates the view.
 */
export class RouterHandler {
  private routes: Route[];
  private currentComponent: HTMLElement | null;

  constructor(routes: Route[]) {
    this.routes = routes;
    this.currentComponent = null;
    this.handleHashChange = this.handleHashChange.bind(this);
    this.route = this.route.bind(this);
  }

  initialize(): void {
    window.addEventListener('hashchange', this.handleHashChange);
    this.route(window.location.hash || '#/');
  }

  private handleHashChange(): void {
    this.route(window.location.hash);
  }

  private route(hash: string): void {
    let matchedRoute = this.routes.find(route => route.regExp.test(hash));
    if (matchedRoute) {
      this.loadComponent(matchedRoute);
    }
  }

  private async loadComponent(route: Route): Promise<void> {
    if (!customElements.get(route.name)) {
      const module = await import(route.path);
      customElements.define(route.name, module.default);
    }
    console.info('loading custom element->', route.name, route.path);

    const newComponent = document.createElement(route.name);
    this.updateView(newComponent);
  }

  private updateView(component: HTMLElement): void {
    this.currentComponent = component;
    console.info('updating view', this.currentComponent);
    document.dispatchEvent(
      new CustomEvent('router-update', { detail: { component } })
    );
  }
}
