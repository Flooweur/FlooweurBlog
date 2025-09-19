export interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleFolder {
  id: string;
  name: string;
  articles: Article[];
  createdAt: Date;
}