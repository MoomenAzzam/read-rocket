export interface Topic {
  id: number;
  name: string;
  emoji: string;
  description: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

// types/articles.ts
export interface Translation {
  lang: string;
  title: string;
  content: string;
}

export interface Article {
  id: string;
  topic: string;
  author: string;
  date: string;
  translations: Translation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  articles?: Article[];
}

export interface QuestionAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}

export interface TestResult {
  id?: string;
  userId: string;
  topic: string;
  language: string;
  wpm: number;
  comprehension: number;
  answers: QuestionAnswer[];
  timestamp?: Date;
}
