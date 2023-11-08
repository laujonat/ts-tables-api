import { loadComponent } from './utils/registry.js';

class AppConfig {
  _fetchBaseUrl: string;
  constructor() {
    this._fetchBaseUrl = 'http://localhost:4000/api/v1';
    this.initialize();
  }

  /**
   * get the fetchBaseUrl
   *
   * @return {string}
   */
  get fetchBaseUrl() {
    return this._fetchBaseUrl;
  }

  /**
   * set the fetchBaseUrl
   *
   * @param {string} url
   */
  set fetchBaseUrl(url) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'preconnect');
    link.setAttribute('href', (this._fetchBaseUrl = url));
    document.head.appendChild(link);
  }

  get currentPath() {
    // This will return the path after the '#' in the URL
    return window.location.hash.slice(1);
  }

  /**
   * get fetch header
   *
   * @returns {{headers: {}}}
   */
  get fetchHeaders() {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    return {
      headers,
    };
  }

  /**
   * Extracts the exam ID from the window location hash
   *
   * @returns {string | null} The extracted exam ID or null if not present
   */
  get getExamIdFromHash(): string {
    const examIdMatch = window.location.hash.match(/^#\/exams\/(\w+)/);
    return examIdMatch ? window.location.href.split('/').reverse()[0] : '';
  }

  get slug() {
    const urlEnding = this.urlEnding;
    if (urlEnding && urlEnding[0].match(/.*-[a-z0-9]{1,100}$/))
      return urlEnding[0];
    return null;
  }

  get urlEnding() {
    return window.location.hash.match(/[^/]+$/);
  }

  private initialize(): Promise<void[]> {
    // Loading components
    const componentsToLoad = [
      loadComponent('app-router', '/static/js/components/app-router.js'),
      loadComponent('app-events', '/static/js/components/app-events.js'),
      loadComponent(
        'app-header',
        '/static/js/components/layout/app-header/app-header.js'
      ),
      loadComponent(
        'app-footer',
        '/static/js/components/layout/app-footer/app-footer.js'
      ),
    ];
    return Promise.all(componentsToLoad);
  }
}

export const App = new AppConfig();
export default App;
