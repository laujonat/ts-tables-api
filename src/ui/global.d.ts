declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Global {}
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface IComponentRegistration {
  tagName: string;
  component: CustomElementConstructor;
}
interface Student {
  id: number;
  name: string;
}

interface ExamResult {
  studentId: number;
  examId: number;
  score: number;
}

interface StudentResult {
  studentId: number;
  score: number;
  rank?: number;
}

// Type single exam's data.
interface ExamData {
  id: number;
  studentCount: number;
  average: number;
}

interface ExamsEventDetail {
  exams: ExamData[];
}

interface ExamResultDetail {
  results: StudentResult[];
  average: number;
  examId?: number | string;
}
