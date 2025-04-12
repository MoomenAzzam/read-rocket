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
  type DocumentData,
} from "firebase/firestore";
import type { Article, Topic, Translation } from "../types";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    topics: [] as Topic[],
    currentArticle: null as Article | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch all topics and their articles
    async fetchTopics() {
      const { $db } = useNuxtApp();

      if (!$db) throw new Error("Firestore not initialized");
      try {
        this.loading = true;
        const snapshot = await getDocs(collection($db, "articles"));

        this.topics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Topic[];
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch single article by ID
    async fetchArticle(id: string) {
      const { $db } = useNuxtApp();
      if (!$db) throw new Error("Firestore not initialized");
      try {
        this.loading = true;
        const docRef = doc($db, "articles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.currentArticle = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Article;
        } else {
          throw new Error("Article not found");
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new article
    async createArticle(articleData: Omit<Article, "id">) {
      const { $db } = useNuxtApp();
      if (!$db) throw new Error("Firestore not initialized");
      try {
        this.loading = true;
        const articleRef = doc(collection($db, "articles"));
        await setDoc(articleRef, {
          ...articleData,
          id: articleRef.id,
          createdAt: new Date().toISOString(),
        });
        return articleRef.id;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update existing article
    async updateArticle(id: string, articleData: Partial<Article>) {
      const { $db } = useNuxtApp();
      if (!$db) throw new Error("Firestore not initialized");
      try {
        this.loading = true;
        const articleRef = doc($db, "articles", id);
        await setDoc(
          articleRef,
          {
            ...articleData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete article
    async deleteArticle(id: string) {
      const { $db } = useNuxtApp();
      if (!$db) throw new Error("Firestore not initialized");
      try {
        this.loading = true;
        await deleteDoc(doc($db, "articles", id));
        // Remove from local state
        this.topics = this.topics.map((topic) => ({
          ...topic,
          articles:
            topic.articles?.filter((article) => article.id !== id) || [],
        }));
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchRandomArticleByTopic(topic: string, lang: string) {
      const { $db } = useNuxtApp();
      console.log(topic, lang);
      if (!$db) throw new Error("Firestore not initialized");

      try {
        this.loading = true;

        // Create a query that filters by topic
        const articlesRef = collection($db, "articles");
        const q = query(articlesRef, where("topic", "==", topic));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error(`No articles found for topic: ${topic}`);
        }

        // Convert docs to array and filter by available language
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
          throw new Error(
            `No ${lang} translations available for ${topic} articles`
          );
        }

        // Select a random article
        const randomIndex = Math.floor(Math.random() * articles.length);
        this.currentArticle = articles[randomIndex].translations.filter((l) => {
          return l.lang == lang;
        })[0];

        return this.currentArticle;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    // Get article by ID
    getArticleById: (state) => (id: string) => {
      for (const topic of state.topics) {
        const article = topic.articles?.find((article) => article.id === id);
        if (article) return article;
      }
      return null;
    },

    // Get articles by topic
    getArticlesByTopic: (state) => (topicName: string) => {
      const topic = state.topics.find((topic) => topic.name === topicName);
      return topic?.articles || [];
    },
  },
});
