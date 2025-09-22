import { Article, Tag } from '../types/Article';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        return { error: errorData.error || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Article operations
  async getArticles(): Promise<ApiResponse<Article[]>> {
    return this.request<Article[]>('/articles');
  }

  async getArticle(id: string): Promise<ApiResponse<Article>> {
    return this.request<Article>(`/articles/${id}`);
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<ApiResponse<Article>> {
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.request<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async searchArticles(query: string): Promise<ApiResponse<Article[]>> {
    return this.request<Article[]>(`/articles/search/${encodeURIComponent(query)}`);
  }

  // Tag operations
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>('/tags');
  }

  async createTag(name: string): Promise<ApiResponse<Tag>> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();