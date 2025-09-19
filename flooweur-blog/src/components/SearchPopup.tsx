import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch, FiFilter, FiPlus, FiFolder, FiFileText, FiTag } from 'react-icons/fi';
import { Button, Input, Modal, ModalContent } from '../styles/GlobalStyles';
import { Article, ArticleFolder } from '../types/Article';

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

  &:hover {
    background-color: var(--bg-secondary);
    border-color: var(--accent);
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
  articles: Article[];
  folders: ArticleFolder[];
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
  onNewArticle,
  onSelectArticle,
  articles,
  folders
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFoldersOnly, setShowFoldersOnly] = useState(false);

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
          <NewArticleButton variant="primary" onClick={onNewArticle}>
            <FiPlus />
            New Article
          </NewArticleButton>
        </ActionsSection>

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
            <ArticleItem key={article.id} onClick={() => onSelectArticle(article)}>
              <ArticleIcon>
                <FiFileText />
              </ArticleIcon>
              <ArticleInfo>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleMeta>
                  <span>{article.createdAt.toLocaleDateString()}</span>
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