import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import PresentationPage from './components/PresentationPage';
import SearchPopup from './components/SearchPopup';
import ArticleEditor from './components/ArticleEditor';
import { Article, ArticleFolder } from './types/Article';
import { exportArticleToPDF } from './utils/pdfExport';

type AppView = 'presentation' | 'search' | 'editor';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('presentation');
  const [articles, setArticles] = useState<Article[]>([]);
  const [folders, setFolders] = useState<ArticleFolder[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>();

  // Load articles from localStorage on component mount
  useEffect(() => {
    const savedArticles = localStorage.getItem('flooweur-blog-articles');
    const savedFolders = localStorage.getItem('flooweur-blog-folders');
    
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        }));
        setArticles(parsedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    }

    if (savedFolders) {
      try {
        const parsedFolders = JSON.parse(savedFolders).map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
          articles: folder.articles.map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt)
          }))
        }));
        setFolders(parsedFolders);
      } catch (error) {
        console.error('Error loading folders:', error);
      }
    }
  }, []);

  // Save articles to localStorage whenever articles change
  useEffect(() => {
    localStorage.setItem('flooweur-blog-articles', JSON.stringify(articles));
  }, [articles]);

  // Save folders to localStorage whenever folders change
  useEffect(() => {
    localStorage.setItem('flooweur-blog-folders', JSON.stringify(folders));
  }, [folders]);

  const handleSearchClick = () => {
    setCurrentView('search');
  };

  const handleCloseSearch = () => {
    setCurrentView('presentation');
  };

  const handleNewArticle = () => {
    setCurrentArticle(undefined);
    setCurrentView('editor');
  };

  const handleSelectArticle = (article: Article) => {
    setCurrentArticle(article);
    setCurrentView('editor');
  };

  const handleSaveArticle = (article: Article) => {
    if (currentArticle) {
      // Update existing article
      setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    } else {
      // Add new article
      setArticles(prev => [...prev, article]);
    }
    setCurrentView('presentation');
  };

  const handleBackToPresentation = () => {
    setCurrentView('presentation');
    setCurrentArticle(undefined);
  };

  const handleExportPDF = async (article: Article) => {
    try {
      await exportArticleToPDF(article);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  // Get unique folder names from articles
  const folderNames = Array.from(new Set(articles.map(article => article.folder).filter(Boolean)));

  return (
    <ThemeProvider>
      <GlobalStyles />
      <div className="App">
        {currentView === 'presentation' && (
          <PresentationPage onSearchClick={handleSearchClick} />
        )}
        
        {currentView === 'search' && (
          <SearchPopup
            isOpen={true}
            onClose={handleCloseSearch}
            onNewArticle={handleNewArticle}
            onSelectArticle={handleSelectArticle}
            articles={articles}
            folders={folders}
          />
        )}
        
        {currentView === 'editor' && (
          <ArticleEditor
            article={currentArticle}
            onSave={handleSaveArticle}
            onBack={handleBackToPresentation}
            onExportPDF={handleExportPDF}
            folders={folderNames}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
