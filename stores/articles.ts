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
  type DocumentData,
} from "firebase/firestore";
import type {
  Article,
  Topic,
  Translation,
  TestResult,
  QuestionAnswer,
} from "../types";
import { toast } from "vue3-toastify";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    topics: [] as Topic[],
    currentArticle: null as Article | null,
    isLoading: false,
    error: null as string | null,
    recentResults: [] as TestResult[],
  }),

  actions: {
    async fetchTopics() {
      const { $db } = useNuxtApp();

      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }
      try {
        this.isLoading = true;
        const snapshot = await getDocs(collection($db, "articles"));

        this.topics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Topic[];
        toast.success("Topics loaded successfully");
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to load topics");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchArticle(id: string) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }
      try {
        this.isLoading = true;
        const docRef = doc($db, "articles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.currentArticle = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Article;
          toast.success("Article loaded successfully");
        } else {
          toast.error("Article not found");
          throw new Error("Article not found");
        }
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to load article");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createArticle(articleData: Omit<Article, "id">) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }
      try {
        this.isLoading = true;
        const articleRef = doc(collection($db, "articles"));
        await setDoc(articleRef, {
          ...articleData,
          id: articleRef.id,
          createdAt: new Date().toISOString(),
        });
        toast.success("Article created successfully");
        return articleRef.id;
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to create article");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateArticle(id: string, articleData: Partial<Article>) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }
      try {
        this.isLoading = true;
        const articleRef = doc($db, "articles", id);
        await setDoc(
          articleRef,
          {
            ...articleData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        toast.success("Article updated successfully");
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to update article");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteArticle(id: string) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }
      try {
        this.isLoading = true;
        await deleteDoc(doc($db, "articles", id));
        this.topics = this.topics.map((topic) => ({
          ...topic,
          articles:
            topic.articles?.filter((article) => article.id !== id) || [],
        }));
        toast.success("Article deleted successfully");
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to delete article");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRandomArticleByTopic(topic: string, lang: string) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }

      try {
        this.isLoading = true;
        const articlesRef = collection($db, "articles");
        const q = query(articlesRef, where("topic", "==", topic));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error(`No articles found for topic: ${topic}`);
          throw new Error(`No articles found for topic: ${topic}`);
        }

        const articles = querySnapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Article)
          )
          .filter((article) =>
            article.translations?.some((t: any) => t.lang === lang)
          );

        if (articles.length === 0) {
          toast.error(
            `No ${lang} translations available for ${topic} articles`
          );
          throw new Error(
            `No ${lang} translations available for ${topic} articles`
          );
        }

        const randomIndex = Math.floor(Math.random() * articles.length);
        const randomArticle = articles[randomIndex];
        this.currentArticle = randomArticle.translations.filter((l) => {
          return l.lang == lang;
        })[0];

        return this.currentArticle;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveTestResults(params: {
      userId: string;
      topic: string;
      language: string;
      wpm: number;
      comprehension: number;
      answers: QuestionAnswer[];
    }) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Database not available");
        throw new Error("Firestore not initialized");
      }

      try {
        this.isLoading = true;
        this.error = null;

        const userRef = doc($db, "users", params.userId);
        const testResultsRef = collection(userRef, "testResults");
        const docRef = await addDoc(testResultsRef, {
          topic: params.topic,
          language: params.language,
          wpm: params.wpm,
          comprehension: params.comprehension,
          answers: params.answers,
        });

        this.recentResults.unshift({
          id: docRef.id,
          ...params,
          timestamp: new Date(),
        });

        toast.success("Test results saved successfully");
        return docRef.id;
      } catch (error: any) {
        this.error = error.message;
        toast.error("Failed to save test results");
        throw error;
      } finally {
        this.isLoading = false;
      }
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
