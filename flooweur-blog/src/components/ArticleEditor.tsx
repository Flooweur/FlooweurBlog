import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FiSave, FiEye, FiEdit3, FiArrowLeft, FiDownload, FiTag, FiFolder, FiUpload, FiFile } from 'react-icons/fi';
import { Button, Input, TextArea, Card } from '../styles/GlobalStyles';
import { Article } from '../types/Article';
import { saveArticleAsJSON, loadArticleFromJSON } from '../utils/jsonStorage';

const EditorContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

const EditorHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const EditorContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: calc(100vh - 120px);
`;

const EditorPanel = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const PreviewPanel = styled(Card)`
  overflow-y: auto;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

const TagsInput = styled(Input)`
  margin-bottom: 12px;
`;

const TagsList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const TagItem = styled.span`
  background-color: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const FolderSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
`;

const MarkdownEditor = styled(TextArea)`
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  min-height: 400px;
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

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ToggleButton = styled(Button)<{ active?: boolean }>`
  ${props => props.active && `
    background-color: var(--accent);
    color: white;
  `}
`;

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onBack: () => void;
  onExportPDF: (article: Article) => void;
  folders: string[];
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  onSave,
  onBack,
  onExportPDF,
  folders
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [folder, setFolder] = useState(article?.folder || '');
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const articleData: Article = {
      id: article?.id || Date.now().toString(),
      title,
      content,
      tags,
      folder: folder || undefined,
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date()
    };
    onSave(articleData);
  };

  const handleSaveAsJSON = () => {
    const articleData: Article = {
      id: article?.id || Date.now().toString(),
      title,
      content,
      tags,
      folder: folder || undefined,
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date()
    };
    saveArticleAsJSON(articleData);
  };

  const handleLoadFromJSON = async () => {
    try {
      const loadedArticle = await loadArticleFromJSON();
      setTitle(loadedArticle.title);
      setContent(loadedArticle.content);
      setTags(loadedArticle.tags);
      setFolder(loadedArticle.folder || '');
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Error loading article from JSON file');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, tags, folder]);

  return (
    <EditorContainer>
      <EditorHeader>
        <BackButton variant="ghost" onClick={onBack}>
          <FiArrowLeft />
          Back
        </BackButton>
        <HeaderActions>
          <Button variant="secondary" onClick={handleLoadFromJSON}>
            <FiUpload />
            Load JSON
          </Button>
          <Button variant="secondary" onClick={handleSaveAsJSON}>
            <FiFile />
            Save JSON
          </Button>
          <Button variant="secondary" onClick={() => onExportPDF({
            id: article?.id || Date.now().toString(),
            title,
            content,
            tags,
            folder: folder || undefined,
            createdAt: article?.createdAt || new Date(),
            updatedAt: new Date()
          })}>
            <FiDownload />
            Export PDF
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FiSave />
            Save (Ctrl+S)
          </Button>
        </HeaderActions>
      </EditorHeader>

      <EditorContent>
        <EditorPanel>
          <FormSection>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
            />
          </FormSection>

          <FormSection>
            <Label htmlFor="folder">Folder</Label>
            <FolderSelect
              id="folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            >
              <option value="">No folder</option>
              {folders.map(folderName => (
                <option key={folderName} value={folderName}>{folderName}</option>
              ))}
            </FolderSelect>
          </FormSection>

          <FormSection>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag and press Enter..."
              onKeyPress={handleKeyPress}
            />
            <TagsList>
              {tags.map(tag => (
                <TagItem key={tag}>
                  <FiTag />
                  {tag}
                  <RemoveTagButton onClick={() => handleRemoveTag(tag)}>
                    ×
                  </RemoveTagButton>
                </TagItem>
              ))}
            </TagsList>
          </FormSection>

          <FormSection>
            <Label htmlFor="content">Content (Markdown)</Label>
            <ViewToggle>
              <ToggleButton
                variant="secondary"
                active={viewMode === 'edit'}
                onClick={() => setViewMode('edit')}
              >
                <FiEdit3 />
                Edit
              </ToggleButton>
              <ToggleButton
                variant="secondary"
                active={viewMode === 'preview'}
                onClick={() => setViewMode('preview')}
              >
                <FiEye />
                Preview
              </ToggleButton>
              <ToggleButton
                variant="secondary"
                active={viewMode === 'split'}
                onClick={() => setViewMode('split')}
              >
                Split
              </ToggleButton>
            </ViewToggle>
            <MarkdownEditor
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown..."
              onKeyDown={handleKeyPress}
            />
          </FormSection>
        </EditorPanel>

        {(viewMode === 'preview' || viewMode === 'split') && (
          <PreviewPanel>
            <h3>Preview</h3>
            <PreviewContent>
              <ReactMarkdown>{content}</ReactMarkdown>
            </PreviewContent>
          </PreviewPanel>
        )}
      </EditorContent>
    </EditorContainer>
  );
};

export default ArticleEditor;