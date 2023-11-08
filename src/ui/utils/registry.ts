export default class ComponentRegistry {
  static register(components: IComponentRegistration[]) {
    components.forEach(component => {
      console.log(component);
      // Define the custom element with the tag name and component class
      window.customElements.define(component.tagName, component.component);
    });
  }
}

export async function loadComponent(tagName: string, modulePath: string) {
  if (!customElements.get(tagName)) {
    const module = await import(modulePath);
    customElements.define(tagName, module.default);
  }
}
