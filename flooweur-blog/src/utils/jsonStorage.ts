import { Article, ArticleFolder } from '../types/Article';

export const saveArticleAsJSON = (article: Article): void => {
  const jsonData = {
    id: article.id,
    title: article.title,
    content: article.content,
    tags: article.tags,
    folder: article.folder,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString()
  };

  const fileName = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadArticleFromJSON = (): Promise<Article> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const article: Article = {
            id: jsonData.id || Date.now().toString(),
            title: jsonData.title || 'Untitled',
            content: jsonData.content || '',
            tags: jsonData.tags || [],
            folder: jsonData.folder,
            createdAt: jsonData.createdAt ? new Date(jsonData.createdAt) : new Date(),
            updatedAt: jsonData.updatedAt ? new Date(jsonData.updatedAt) : new Date()
          };
          resolve(article);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    };

    input.oncancel = () => reject(new Error('File selection cancelled'));
    input.click();
  });
};

export const saveAllArticlesAsJSON = (articles: Article[]): void => {
  const jsonData = {
    articles: articles.map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      tags: article.tags,
      folder: article.folder,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString()
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };

  const fileName = `flooweur-blog-backup-${new Date().toISOString().split('T')[0]}.json`;
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadAllArticlesFromJSON = (): Promise<Article[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const articles: Article[] = jsonData.articles.map((articleData: any) => ({
            id: articleData.id || Date.now().toString(),
            title: articleData.title || 'Untitled',
            content: articleData.content || '',
            tags: articleData.tags || [],
            folder: articleData.folder,
            createdAt: articleData.createdAt ? new Date(articleData.createdAt) : new Date(),
            updatedAt: articleData.updatedAt ? new Date(articleData.updatedAt) : new Date()
          }));
          resolve(articles);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    };

    input.oncancel = () => reject(new Error('File selection cancelled'));
    input.click();
  });
};