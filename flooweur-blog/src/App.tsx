import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import PresentationPage from './components/PresentationPage';
import SearchPopup from './components/SearchPopup';
import ArticleEditor from './components/ArticleEditor';
import ArticlePreview from './components/ArticlePreview';
import GlobalSearchButton from './components/GlobalSearchButton';
import { Article, Tag } from './types/Article';
import { apiService } from './services/api';

type AppView = 'presentation' | 'search' | 'editor';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('presentation');
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>();
  const [previewArticle, setPreviewArticle] = useState<Article | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load articles and tags from MongoDB on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [articlesResponse, tagsResponse] = await Promise.all([
          apiService.getArticles(),
          apiService.getTags()
        ]);

        if (articlesResponse.data) {
          setArticles(articlesResponse.data);
        } else {
          console.error('Error loading articles:', articlesResponse.error);
        }

        if (tagsResponse.data) {
          setTags(tagsResponse.data);
        } else {
          console.error('Error loading tags:', tagsResponse.error);
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
          />
        )}

        <SearchPopup
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          onNewArticle={handleNewArticle}
          onEditArticle={handleEditArticle}
          onPreviewArticle={handlePreviewArticle}
          articles={articles}
          tags={tags}
        />

        {previewArticle && (
          <ArticlePreview
            article={previewArticle}
            isOpen={!!previewArticle}
            onClose={handleClosePreview}
            onEdit={handleEditArticle}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
