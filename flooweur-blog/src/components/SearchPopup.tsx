import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch, FiFilter, FiPlus, FiFolder, FiFileText, FiTag, FiUpload, FiDownload, FiEdit3 } from 'react-icons/fi';
import { Button, Input, Modal, ModalContent } from '../styles/GlobalStyles';
import { Article, ArticleFolder } from '../types/Article';
import { saveAllArticlesAsJSON, loadAllArticlesFromJSON } from '../utils/jsonStorage';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const SearchInput = styled(Input)`
  flex: 1;
  padding-left: 40px;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const ActionsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const NewArticleButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const TagFilter = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
`;

const ArticlesList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ArticleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: var(--bg-secondary);
    border-color: var(--accent);
  }
`;

const ArticleActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;

const ArticleIcon = styled.div`
  color: var(--text-secondary);
  font-size: 20px;
`;

const ArticleInfo = styled.div`
  flex: 1;
`;

const ArticleTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
`;

const ArticleTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
`;

const FolderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary);
    border-color: var(--accent);
  }
`;

const FolderIcon = styled.div`
  color: var(--accent);
  font-size: 20px;
`;

const FolderInfo = styled.div`
  flex: 1;
`;

const FolderName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
`;

const FolderCount = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNewArticle: () => void;
  onSelectArticle: (article: Article) => void;
  onEditArticle: (article: Article) => void;
  onPreviewArticle: (article: Article) => void;
  onImportArticles: (articles: Article[]) => void;
  onCreateFolder: (name: string) => void;
  articles: Article[];
  folders: ArticleFolder[];
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
  onNewArticle,
  onSelectArticle,
  onEditArticle,
  onPreviewArticle,
  onImportArticles,
  onCreateFolder,
  articles,
  folders
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFoldersOnly, setShowFoldersOnly] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || article.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const filteredFolders = folders.filter(folder => {
    return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExportAll = () => {
    saveAllArticlesAsJSON(articles);
  };

  const handleImportAll = async () => {
    try {
      const importedArticles = await loadAllArticlesFromJSON();
      onImportArticles(importedArticles);
      alert(`Successfully imported ${importedArticles.length} articles!`);
    } catch (error) {
      console.error('Error importing articles:', error);
      alert('Error importing articles from JSON file');
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateFolder();
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        <SearchHeader>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </SearchHeader>

        <ActionsSection>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={handleImportAll}>
              <FiUpload />
              Import JSON
            </Button>
            <Button variant="secondary" onClick={handleExportAll}>
              <FiDownload />
              Export All
            </Button>
            <Button variant="secondary" onClick={() => setShowNewFolderInput(!showNewFolderInput)}>
              <FiFolder />
              New Folder
            </Button>
          </div>
          <NewArticleButton variant="primary" onClick={onNewArticle}>
            <FiPlus />
            New Article
          </NewArticleButton>
        </ActionsSection>

        {showNewFolderInput && (
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              onKeyPress={handleKeyPress}
              style={{ flex: 1 }}
            />
            <Button variant="primary" onClick={handleCreateFolder}>
              Create
            </Button>
            <Button variant="secondary" onClick={() => setShowNewFolderInput(false)}>
              Cancel
            </Button>
          </div>
        )}

        <FilterSection>
          <FilterButton variant="secondary" onClick={() => setShowFoldersOnly(!showFoldersOnly)}>
            <FiFilter />
            {showFoldersOnly ? 'Show Articles' : 'Show Folders Only'}
          </FilterButton>
          <TagFilter
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </TagFilter>
        </FilterSection>

        <ArticlesList>
          {!showFoldersOnly && filteredArticles.map(article => (
            <ArticleItem key={article._id || article.id}>
              <ArticleIcon>
                <FiFileText />
              </ArticleIcon>
              <ArticleInfo onClick={() => onPreviewArticle(article)}>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleMeta>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  {article.folder && <span>📁 {article.folder}</span>}
                </ArticleMeta>
                <ArticleTags>
                  {article.tags.map(tag => (
                    <Tag key={tag}>
                      <FiTag style={{ marginRight: 4 }} />
                      {tag}
                    </Tag>
                  ))}
                </ArticleTags>
              </ArticleInfo>
              <ArticleActions>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  onEditArticle(article);
                }} title="Edit article">
                  <FiEdit3 />
                </ActionButton>
              </ArticleActions>
            </ArticleItem>
          ))}

          {showFoldersOnly && filteredFolders.map(folder => (
            <FolderItem key={folder.id}>
              <FolderIcon>
                <FiFolder />
              </FolderIcon>
              <FolderInfo>
                <FolderName>{folder.name}</FolderName>
                <FolderCount>{folder.articles.length} articles</FolderCount>
              </FolderInfo>
            </FolderItem>
          ))}
        </ArticlesList>
      </ModalContent>
    </Modal>
  );
};

export default SearchPopup;