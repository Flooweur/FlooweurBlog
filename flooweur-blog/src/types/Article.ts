export interface Article {
  _id?: string;
  id?: string; // For compatibility
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ArticleFolder {
  _id?: string;
  id?: string; // For compatibility
  name: string;
  createdAt: Date | string;
}