import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiArrowLeft, FiTag } from 'react-icons/fi';
import { Button, Input, TextArea } from '../styles/GlobalStyles';
import { Article, Tag } from '../types/Article';
import { apiService } from '../services/api';

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
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
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

const TagSelectionContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TagSelect = styled.select`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
`;

const AddTagButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkdownEditor = styled(TextArea)`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  min-height: 500px;
  resize: vertical;
`;

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onBack: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  onSave,
  onBack
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tags, setTags] = useState<Tag[]>(article?.tags && Array.isArray(article.tags) ? article.tags : []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState('');

  // Load available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await apiService.getTags();
        if (response.data) {
          setAvailableTags(response.data);
        }
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };
    loadTags();
  }, []);

  const handleAddTag = async () => {
    if (selectedTagId) {
      const selectedTag = availableTags.find(tag => tag._id === selectedTagId);
      if (selectedTag && !tags.find(tag => tag._id === selectedTag._id)) {
        setTags([...tags, selectedTag]);
        setSelectedTagId('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    setTags(tags.filter(tag => tag._id !== tagToRemove._id));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const articleData: Article = {
      _id: article?._id || article?.id,
      title,
      content,
      tags,
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    onSave(articleData);
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
  }, [title, content, tags]);

  return (
    <EditorContainer>
      <EditorHeader>
        <BackButton variant="ghost" onClick={onBack}>
          <FiArrowLeft />
          Back
        </BackButton>
        <HeaderActions>
          <Button variant="primary" onClick={handleSave}>
            <FiSave />
            Save (Ctrl+S)
          </Button>
        </HeaderActions>
      </EditorHeader>

      <EditorContent>
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
          <Label htmlFor="tags">Tags</Label>
          <TagSelectionContainer>
            <TagSelect
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
            >
              <option value="">Select a tag...</option>
              {availableTags.map(tag => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </TagSelect>
            <AddTagButton variant="secondary" onClick={handleAddTag}>
              <FiTag />
              Add Tag
            </AddTagButton>
          </TagSelectionContainer>
          <TagsList>
            {tags.map(tag => (
              <TagItem key={tag._id}>
                <FiTag />
                {tag.name}
                <RemoveTagButton onClick={() => handleRemoveTag(tag)}>
                  ×
                </RemoveTagButton>
              </TagItem>
            ))}
          </TagsList>
        </FormSection>

        <FormSection>
          <Label htmlFor="content">Content (Markdown)</Label>
          <MarkdownEditor
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article in Markdown..."
            onKeyDown={handleKeyPress}
          />
        </FormSection>
      </EditorContent>
    </EditorContainer>
  );
};

export default ArticleEditor;