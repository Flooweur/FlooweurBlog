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
  tags: Tag[]; // Should always be an array, but components should handle undefined/null cases
  createdAt: Date | string;
  updatedAt: Date | string;
}