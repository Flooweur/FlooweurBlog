import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FiX, FiEdit3 } from 'react-icons/fi';
import { Modal, ModalContent, Button } from '../styles/GlobalStyles';
import { Article } from '../types/Article';

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
`;

const PreviewTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
`;

const PreviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-secondary);
`;

const PreviewTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const Tag = styled.span`
  background-color: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
`;

const PreviewContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
  }

  h1 {
    font-size: 2rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 8px;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 16px;
  }

  ul, ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }

  blockquote {
    border-left: 4px solid var(--accent);
    padding-left: 16px;
    margin: 16px 0;
    color: var(--text-secondary);
    font-style: italic;
  }

  code {
    background-color: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
  }

  pre {
    background-color: var(--bg-tertiary);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;

    code {
      background: none;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background-color: var(--bg-secondary);
    font-weight: 600;
  }

  a {
    color: var(--accent);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
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

interface ArticlePreviewProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (article: Article) => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  isOpen,
  onClose,
  onEdit
}) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalContent style={{ maxWidth: '800px', maxHeight: '90vh' }}>
        <PreviewHeader>
          <div>
            <PreviewTitle>{article.title}</PreviewTitle>
            <PreviewMeta>
              <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
              {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
              )}
              {article.folder && <span>📁 {article.folder}</span>}
            </PreviewMeta>
            {article.tags.length > 0 && (
              <PreviewTags>
                {article.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </PreviewTags>
            )}
          </div>
          <HeaderActions>
            <Button variant="primary" onClick={() => onEdit(article)}>
              <FiEdit3 />
              Edit
            </Button>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </HeaderActions>
        </PreviewHeader>

        <PreviewContent>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </PreviewContent>
      </ModalContent>
    </Modal>
  );
};

export default ArticlePreview;