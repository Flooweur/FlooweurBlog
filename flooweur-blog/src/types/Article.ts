export interface Tag {
  _id?: string;
  id?: string; // For compatibility
  name: string;
  createdAt: Date | string;
}

export interface Article {
  _id?: string;
  id?: string; // For compatibility
  title: string;
  content: string;
  tags: Tag[];
  createdAt: Date | string;
  updatedAt: Date | string;
}