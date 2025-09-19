import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiSave, 
  FiArrowLeft, 
  FiTag, 
  FiBold, 
  FiItalic, 
  FiUnderline,
  FiLink,
  FiImage,
  FiList,
  FiCode,
  FiQuote,
  FiMinus,
  FiType,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight
} from 'react-icons/fi';
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

const TagInput = styled(Input)`
  flex: 1;
`;

const AddTagButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditorToolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${props => props.active ? 'var(--accent-hover)' : 'var(--bg-tertiary)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const MarkdownEditor = styled(TextArea)`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  min-height: 500px;
  resize: vertical;
  border-radius: 0 0 8px 8px;
  border-top: none;
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
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
  const [newTagName, setNewTagName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (newTagName.trim()) {
      // Check if tag already exists in available tags
      let existingTag = availableTags.find(tag => 
        tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      );
      
      // If tag doesn't exist, create a new one
      if (!existingTag) {
        try {
          const response = await apiService.createTag(newTagName.trim());
          if (response.data) {
            existingTag = response.data;
            setAvailableTags(prev => [...prev, existingTag!]);
          } else {
            throw new Error(response.error || 'Failed to create tag');
          }
        } catch (error) {
          console.error('Error creating tag:', error);
          alert('Error creating tag. Please try again.');
          return;
        }
      }
      
      // Add tag to article if not already added
      if (existingTag && !tags.find(tag => tag._id === existingTag._id)) {
        setTags([...tags, existingTag]);
      }
      
      setNewTagName('');
    }
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    setTags(tags.filter(tag => tag._id !== tagToRemove._id));
  };

  // Markdown toolbar functions
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const currentLine = lines.length - 1;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    
    const newContent = 
      content.substring(0, lineStart) + 
      prefix + 
      content.substring(lineStart);
    
    setContent(newContent);
    
    setTimeout(() => {
      const newCursorPos = start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleBold = () => insertText('**', '**', 'bold text');
  const handleItalic = () => insertText('*', '*', 'italic text');
  const handleCode = () => insertText('`', '`', 'code');
  const handleCodeBlock = () => insertText('```\n', '\n```', 'code block');
  const handleQuote = () => insertAtLineStart('> ');
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) insertText('[', `](${url})`, 'link text');
  };
  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) insertText('![', `](${url})`, 'alt text');
  };
  const handleList = () => insertAtLineStart('- ');
  const handleNumberedList = () => insertAtLineStart('1. ');
  const handleHorizontalRule = () => insertText('\n---\n');
  const handleHeading = (level: number) => insertAtLineStart('#'.repeat(level) + ' ');

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
            <TagInput
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
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
          <EditorSection>
            <EditorToolbar>
              <ToolbarButton onClick={() => handleHeading(1)} title="Heading 1">
                <FiType />
              </ToolbarButton>
              <ToolbarButton onClick={() => handleHeading(2)} title="Heading 2">
                <FiType />
              </ToolbarButton>
              <ToolbarButton onClick={() => handleHeading(3)} title="Heading 3">
                <FiType />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleBold} title="Bold">
                <FiBold />
              </ToolbarButton>
              <ToolbarButton onClick={handleItalic} title="Italic">
                <FiItalic />
              </ToolbarButton>
              <ToolbarButton onClick={handleCode} title="Inline Code">
                <FiCode />
              </ToolbarButton>
              <ToolbarButton onClick={handleCodeBlock} title="Code Block">
                <FiCode />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleLink} title="Link">
                <FiLink />
              </ToolbarButton>
              <ToolbarButton onClick={handleImage} title="Image">
                <FiImage />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleList} title="Bullet List">
                <FiList />
              </ToolbarButton>
              <ToolbarButton onClick={handleNumberedList} title="Numbered List">
                1.
              </ToolbarButton>
              <ToolbarButton onClick={handleQuote} title="Quote">
                <FiQuote />
              </ToolbarButton>
              <ToolbarButton onClick={handleHorizontalRule} title="Horizontal Rule">
                <FiMinus />
              </ToolbarButton>
            </EditorToolbar>
            <MarkdownEditor
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown..."
              onKeyDown={handleKeyPress}
            />
          </EditorSection>
        </FormSection>
      </EditorContent>
    </EditorContainer>
  );
};

export default ArticleEditor;