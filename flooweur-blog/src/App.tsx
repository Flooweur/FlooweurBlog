import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import PresentationPage from './components/PresentationPage';
import SearchPopup from './components/SearchPopup';
import ArticleEditor from './components/ArticleEditor';
import ArticlePreview from './components/ArticlePreview';
import GlobalSearchButton from './components/GlobalSearchButton';
import { Article, ArticleFolder } from './types/Article';
import { exportArticleToPDF } from './utils/pdfExport';
import { saveArticleAsJSON } from './utils/jsonStorage';
import { apiService } from './services/api';

type AppView = 'presentation' | 'search' | 'editor';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('presentation');
  const [articles, setArticles] = useState<Article[]>([]);
  const [folders, setFolders] = useState<ArticleFolder[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>();
  const [previewArticle, setPreviewArticle] = useState<Article | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load articles and folders from MongoDB on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [articlesResponse, foldersResponse] = await Promise.all([
          apiService.getArticles(),
          apiService.getFolders()
        ]);

        if (articlesResponse.data) {
          setArticles(articlesResponse.data);
        } else {
          console.error('Error loading articles:', articlesResponse.error);
        }

        if (foldersResponse.data) {
          setFolders(foldersResponse.data);
        } else {
          console.error('Error loading folders:', foldersResponse.error);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleNewArticle = () => {
    setCurrentArticle(undefined);
    setCurrentView('editor');
    setIsSearchOpen(false);
  };

  const handleSelectArticle = (article: Article) => {
    setCurrentArticle(article);
    setCurrentView('editor');
    setIsSearchOpen(false);
  };

  const handleEditArticle = (article: Article) => {
    setCurrentArticle(article);
    setCurrentView('editor');
    setIsSearchOpen(false);
  };

  const handlePreviewArticle = (article: Article) => {
    setPreviewArticle(article);
  };

  const handleClosePreview = () => {
    setPreviewArticle(undefined);
  };

  const handleSaveArticle = async (article: Article) => {
    try {
      let savedArticle: Article;
      
      if (currentArticle && (currentArticle._id || currentArticle.id)) {
        // Update existing article
        const response = await apiService.updateArticle(
          currentArticle._id || currentArticle.id!, 
          article
        );
        if (response.data) {
          savedArticle = response.data;
          setArticles(prev => prev.map(a => 
            (a._id || a.id) === (currentArticle._id || currentArticle.id) ? savedArticle : a
          ));
        } else {
          throw new Error(response.error || 'Failed to update article');
        }
      } else {
        // Create new article
        const response = await apiService.createArticle(article);
        if (response.data) {
          savedArticle = response.data;
          setArticles(prev => [...prev, savedArticle]);
        } else {
          throw new Error(response.error || 'Failed to create article');
        }
      }
      
      // Automatically save as JSON file
      try {
        saveArticleAsJSON(savedArticle);
      } catch (error) {
        console.error('Error saving article as JSON:', error);
      }
      
      setCurrentView('presentation');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    }
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

  const handleImportArticles = (importedArticles: Article[]) => {
    // Merge imported articles with existing ones, avoiding duplicates
    const existingIds = new Set(articles.map(a => a._id || a.id));
    const newArticles = importedArticles.filter(a => !existingIds.has(a._id || a.id));
    setArticles(prev => [...prev, ...newArticles]);
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await apiService.createFolder(name);
      if (response.data) {
        setFolders(prev => [...prev, response.data!]);
      } else {
        throw new Error(response.error || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder. Please try again.');
    }
  };

  // Get unique folder names from articles
  const folderNames = Array.from(new Set(articles.map(article => article.folder).filter(Boolean)));

  return (
    <ThemeProvider>
      <GlobalStyles />
      <div className="App">
        <GlobalSearchButton onClick={handleSearchClick} />
        
        {currentView === 'presentation' && <PresentationPage />}
        
        {currentView === 'editor' && (
          <ArticleEditor
            article={currentArticle}
            onSave={handleSaveArticle}
            onBack={handleBackToPresentation}
            onExportPDF={handleExportPDF}
            folders={folderNames}
          />
        )}

        <SearchPopup
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          onNewArticle={handleNewArticle}
          onSelectArticle={handleSelectArticle}
          onEditArticle={handleEditArticle}
          onPreviewArticle={handlePreviewArticle}
          onImportArticles={handleImportArticles}
          onCreateFolder={handleCreateFolder}
          articles={articles}
          folders={folders}
        />

        {previewArticle && (
          <ArticlePreview
            article={previewArticle}
            isOpen={!!previewArticle}
            onClose={handleClosePreview}
            onEdit={handleEditArticle}
            onExportPDF={handleExportPDF}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
