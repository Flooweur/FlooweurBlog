import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch, FiFilter, FiPlus, FiFileText, FiTag, FiEdit3 } from 'react-icons/fi';
import { Button, Input, Modal, ModalContent } from '../styles/GlobalStyles';
import { Article, Tag } from '../types/Article';

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

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onPreviewArticle: (article: Article) => void;
  articles: Article[];
  tags: Tag[];
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
  onNewArticle,
  onEditArticle,
  onPreviewArticle,
  articles,
  tags
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || article.tags.some(tag => tag._id === selectedTag);
    return matchesSearch && matchesTag;
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
          <div />
          <NewArticleButton variant="primary" onClick={onNewArticle}>
            <FiPlus />
            New Article
          </NewArticleButton>
        </ActionsSection>

        <FilterSection>
          <TagFilter
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag._id} value={tag._id}>{tag.name}</option>
            ))}
          </TagFilter>
        </FilterSection>

        <ArticlesList>
          {filteredArticles.map(article => (
            <ArticleItem key={article._id || article.id}>
              <ArticleIcon>
                <FiFileText />
              </ArticleIcon>
              <ArticleInfo onClick={() => onPreviewArticle(article)}>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleMeta>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </ArticleMeta>
                <ArticleTags>
                  {article.tags.map(tag => (
                    <Tag key={tag._id}>
                      <FiTag style={{ marginRight: 4 }} />
                      {tag.name}
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
        </ArticlesList>
      </ModalContent>
    </Modal>
  );
};

export default SearchPopup;