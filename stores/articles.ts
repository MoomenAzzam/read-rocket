// stores/articles.ts
import { defineStore } from "pinia";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  where,
  query,
  addDoc,
} from "firebase/firestore";
import type { Article, Topic, TestResult, QuestionAnswer } from "../types";

interface ArticlesState {
  topics: Topic[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  recentResults: TestResult[];
}

export const useArticlesStore = defineStore("articles", {
  state: (): ArticlesState => ({
    topics: [],
    currentArticle: null,
    loading: false,
    error: null,
    recentResults: [],
  }),

  actions: {
    async withErrorHandling<T>(action: () => Promise<T>): Promise<T> {
      try {
        this.loading = true;
        this.error = null;
        return await action();
      } catch (error: unknown) {
        this.error =
          error instanceof Error ? error.message : "An unknown error occurred";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getFirestore() {
      const { $db } = useNuxtApp();
      if (!$db) throw new Error("Firestore not initialized");
      return $db;
    },

    async fetchTopics() {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const snapshot = await getDocs(collection($db, "articles"));
        this.topics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Topic[];
      });
    },

    async fetchArticle(id: string) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const docRef = doc($db, "articles", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Article not found");
        }

        this.currentArticle = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Article;
      });
    },

    async createArticle(articleData: Omit<Article, "id">) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const articleRef = doc(collection($db, "articles"));
        await setDoc(articleRef, {
          ...articleData,
          id: articleRef.id,
          createdAt: new Date().toISOString(),
        });
        return articleRef.id;
      });
    },

    async updateArticle(id: string, articleData: Partial<Article>) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const articleRef = doc($db, "articles", id);
        await setDoc(
          articleRef,
          {
            ...articleData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      });
    },

    async deleteArticle(id: string) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        await deleteDoc(doc($db, "articles", id));

        this.topics = this.topics.map((topic) => ({
          ...topic,
          articles:
            topic.articles?.filter((article) => article.id !== id) || [],
        }));
      });
    },

    async fetchRandomArticleByTopic(topic: string, lang: string) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const articlesRef = collection($db, "articles");
        const q = query(articlesRef, where("topic", "==", topic));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error(`No articles found for topic: ${topic}`);
        }

        const articles = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Article))
          .filter((article) =>
            article.translations?.some((t) => t.lang === lang)
          );

        if (articles.length === 0) {
          throw new Error(
            `No ${lang} translations available for ${topic} articles`
          );
        }

        const randomIndex = Math.floor(Math.random() * articles.length);
        const randomArticle = articles[randomIndex];
        this.currentArticle =
          randomArticle.translations.find((l) => l.lang === lang) || null;

        return this.currentArticle;
      });
    },

    async saveTestResults(params: {
      userId: string;
      topic: string;
      language: string;
      wpm: number;
      comprehension: number;
      answers: QuestionAnswer[];
    }) {
      return this.withErrorHandling(async () => {
        const $db = this.getFirestore();
        const userRef = doc($db, "users", params.userId);
        const testResultsRef = collection(userRef, "testResults");
        const docRef = await addDoc(testResultsRef, {
          ...params,
          timestamp: new Date().toISOString(),
        });

        const result: TestResult = {
          id: docRef.id,
          ...params,
          timestamp: new Date(),
        };

        this.recentResults.unshift(result);
        return docRef.id;
      });
    },
  },

  getters: {
    getArticleById: (state) => (id: string) => {
      for (const topic of state.topics) {
        const article = topic.articles?.find((article) => article.id === id);
        if (article) return article;
      }
      return null;
    },

    getArticlesByTopic: (state) => (topicName: string) => {
      const topic = state.topics.find((topic) => topic?.name === topicName);
      return topic?.articles || [];
    },
  },
});
