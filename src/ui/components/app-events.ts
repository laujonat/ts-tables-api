import { App } from '../index.js';

/**
 * AppEvents handles fetching data from the API.
 * Works as Event Broker (coordinates and manages the event flow)
 *
 * It dispatches custom events with the fetched data.
 *
 * Other components can listen for these events
 * to update their state/render when new data arrives.
 */
export default class AppEvents extends HTMLElement {
  private baseApiUrl: string;
  abortController: AbortController;

  constructor() {
    super();
    this.baseApiUrl = App.fetchBaseUrl;
    this.abortController = new AbortController();
  }

  /**
   * @event requestExamsData
   *   The event that triggers this method. It should be dispatched by
   *   consumers when they require the exam data.
   *
   * @emits eb-examsData
   * The event's `detail` property contains the fetched exam data.
   */
  getExams(): void {
    const url = `${this.baseApiUrl}/exams`;
    this.makeFetchRequest(url, 'eb-examsData', '#/exams');
  }

  /**
   * @event requestStudentsData
   * @emits eb-requestStudentsData
   */
  getStudents(): void {
    const url = `${this.baseApiUrl}/students`;
    this.makeFetchRequest(url, 'eb-requestStudentsData', '#/students');
  }

  /**
   * @event requestStudentById
   * @emits eb-studentById
   */
  getStudentById(studentId: number): void {
    const url = `${this.baseApiUrl}/students/${studentId}`;
    this.makeFetchRequest(url, 'eb-studentById');
  }

  /**
   * @event requestExamResultsById
   * @emits eb-examResults
   */
  getExamResultsById(examId: number): void {
    const url = `${this.baseApiUrl}/exams/${examId}`;
    this.makeFetchRequest(url, 'eb-examResults', `#/exams/${examId}`);
  }

  private makeFetchRequest(
    url: string,
    eventName: string,
    hashChange?: string
  ): void {
    this.abortPreviousRequest();
    fetch(url, {
      signal: this.abortController.signal,
      ...App.fetchHeaders,
    })
      .then(response => response.json())
      .then(data => {
        console.group(`CustomEvent ${eventName}`);
        console.log(`${eventName} data`, data);
        console.groupEnd();
        document.body.dispatchEvent(
          new CustomEvent(eventName, { detail: data })
        );
        if (hashChange && window.location.hash !== hashChange) {
          window.location.hash = hashChange;
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(`Error fetching ${eventName}:`, error);
        }
      });
  }

  private abortPreviousRequest(): void {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
  }

  connectedCallback(): void {
    this.addEventListener('requestExamsData', this.handleRequestExamsData);
    this.addEventListener(
      'requestStudentsData',
      this.handleRequestStudentsData
    );
    this.addEventListener(
      'requestExamResultsById',
      this.handleRequestExamResults
    );
    this.addEventListener('requestStudentById', this.handleRequestStudentById);
  }

  disconnectedCallback() {
    this.removeEventListener('requestExamsData', this.handleRequestExamsData);
    this.removeEventListener(
      'requestStudentsData',
      this.handleRequestStudentsData
    );
    this.removeEventListener(
      'requestExamResultsById',
      this.handleRequestExamResults
    );
    this.removeEventListener(
      'requestStudentById',
      this.handleRequestStudentById
    );
  }

  private handleRequestExamsData = () => this.getExams();
  private handleRequestStudentsData = () => this.getStudents();
  private handleRequestExamResults = (event: Event) => {
    const customEvent = event as CustomEvent<{ examId: number }>;
    this.getExamResultsById(customEvent.detail.examId);
  };
  private handleRequestStudentById = (event: Event) => {
    const customEvent = event as CustomEvent<{ studentId: number }>;
    this.getStudentById(customEvent.detail.studentId);
  };
}
