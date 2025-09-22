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
  FiMessageSquare,
  FiMinus,
  FiType,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiTrash2
} from 'react-icons/fi';
import { Button, Input, TextArea } from '../styles/GlobalStyles';
import { Article, Tag } from '../types/Article';
import { apiService } from '../services/api';

// Icon wrapper to fix TypeScript compatibility with React 19
const Icon = ({ IconComponent, ...props }: { IconComponent: any; [key: string]: any }) => {
  return React.createElement(IconComponent, props);
};

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
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 50%;
    height: 1px;
    background: var(--border-color);
    margin-right: 40px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    right: 0;
    height: 1px;
    background: var(--border-color);
    margin-left: 40px;
  }
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

const TagDropdown = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-light);
  }
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

const CustomizationSection = styled.div`
  margin-top: 48px;
  padding: 24px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
`;

const CustomizationTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CustomizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const CustomizationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  cursor: pointer;
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
  
  &::-webkit-color-swatch-wrapper {
    padding: 2px;
    border-radius: 8px;
  }
`;

const EmojiInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 16px;
  text-align: center;
`;

const PreviewCard = styled.div<{ customization: any }>`
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.customization.cardColor};
  border: 1px solid var(--border-color);
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PreviewIcon = styled.span`
  font-size: 24px;
`;

const PreviewText = styled.div`
  flex: 1;
`;

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onDelete?: (article: Article) => void;
  onBack: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  onSave,
  onDelete,
  onBack
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tags, setTags] = useState<Tag[]>(article?.tags && Array.isArray(article.tags) ? article.tags : []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [customization, setCustomization] = useState({
    backgroundColor: article?.customization?.backgroundColor || '#ffffff',
    cardColor: article?.customization?.cardColor || '#f8f9fa',
    icon: article?.customization?.icon || '📝',
    accentColor: article?.customization?.accentColor || '#007bff'
  });
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
      if (existingTag && !tags.find(tag => tag._id === existingTag!._id)) {
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
      customization,
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    onSave(articleData);
  };

  const handleDelete = () => {
    if (!article || (!article._id && !article.id)) {
      alert('Cannot delete a new article');
      return;
    }

    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      onDelete?.(article);
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
  }, [title, content, tags]);

  return (
    <EditorContainer>
      <EditorHeader>
        <BackButton variant="ghost" onClick={onBack}>
          <Icon IconComponent={FiArrowLeft} size={16} />
          Back
        </BackButton>
        <HeaderActions>
          {article && (article._id || article.id) && onDelete && (
            <Button variant="danger" onClick={handleDelete}>
              <Icon IconComponent={FiTrash2} size={16} />
              Delete
            </Button>
          )}
          <Button variant="primary" onClick={handleSave}>
            <Icon IconComponent={FiSave} size={16} />
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
            <TagDropdown
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  const selectedTag = availableTags.find(tag => tag._id === e.target.value);
                  if (selectedTag && !tags.find(tag => tag._id === selectedTag._id)) {
                    setTags([...tags, selectedTag]);
                  }
                  e.target.value = ''; // Reset dropdown
                }
              }}
            >
              <option value="">Select existing tag...</option>
              {availableTags
                .filter(tag => !tags.find(t => t._id === tag._id))
                .map(tag => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))
              }
            </TagDropdown>
          </TagSelectionContainer>
          <TagSelectionContainer>
            <TagInput
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Or create new tag..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <AddTagButton variant="secondary" onClick={handleAddTag}>
              <Icon IconComponent={FiTag} size={16} />
              Add Tag
            </AddTagButton>
          </TagSelectionContainer>
          <TagsList>
            {tags.map(tag => (
              <TagItem key={tag._id}>
                <Icon IconComponent={FiTag} size={16} />
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
                <Icon IconComponent={FiType} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={() => handleHeading(2)} title="Heading 2">
                <Icon IconComponent={FiType} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={() => handleHeading(3)} title="Heading 3">
                <Icon IconComponent={FiType} size={16} />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleBold} title="Bold">
                <Icon IconComponent={FiBold} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleItalic} title="Italic">
                <Icon IconComponent={FiItalic} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleCode} title="Inline Code">
                <Icon IconComponent={FiCode} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleCodeBlock} title="Code Block">
                <Icon IconComponent={FiCode} size={16} />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleLink} title="Link">
                <Icon IconComponent={FiLink} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleImage} title="Image">
                <Icon IconComponent={FiImage} size={16} />
              </ToolbarButton>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />
              
              <ToolbarButton onClick={handleList} title="Bullet List">
                <Icon IconComponent={FiList} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleNumberedList} title="Numbered List">
                1.
              </ToolbarButton>
              <ToolbarButton onClick={handleQuote} title="Quote">
                <Icon IconComponent={FiMessageSquare} size={16} />
              </ToolbarButton>
              <ToolbarButton onClick={handleHorizontalRule} title="Horizontal Rule">
                <Icon IconComponent={FiMinus} size={16} />
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

        <CustomizationSection>
          <CustomizationTitle>
            🎨 Article Customization
          </CustomizationTitle>
          <CustomizationGrid>
            <CustomizationItem>
              <Label>Background Color</Label>
              <ColorInput
                type="color"
                value={customization.backgroundColor}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  backgroundColor: e.target.value
                }))}
              />
            </CustomizationItem>
            
            <CustomizationItem>
              <Label>Card Color</Label>
              <ColorInput
                type="color"
                value={customization.cardColor}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  cardColor: e.target.value
                }))}
              />
            </CustomizationItem>
            
            <CustomizationItem>
              <Label>Accent Color</Label>
              <ColorInput
                type="color"
                value={customization.accentColor}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  accentColor: e.target.value
                }))}
              />
            </CustomizationItem>
            
            <CustomizationItem>
              <Label>Article Icon</Label>
              <EmojiInput
                type="text"
                value={customization.icon}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  icon: e.target.value
                }))}
                placeholder="🚀"
                maxLength={4}
              />
            </CustomizationItem>
          </CustomizationGrid>
          
          <PreviewCard customization={customization}>
            <PreviewIcon>{customization.icon}</PreviewIcon>
            <PreviewText>
              <strong>Preview:</strong> {title || 'Article Title'} with custom styling
            </PreviewText>
          </PreviewCard>
        </CustomizationSection>
      </EditorContent>
    </EditorContainer>
  );
};

export default ArticleEditor;