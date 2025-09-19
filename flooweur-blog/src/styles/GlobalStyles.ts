import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  html[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-tertiary: #e9ecef;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --text-muted: #adb5bd;
    --border-color: #dee2e6;
    --shadow: rgba(0, 0, 0, 0.1);
    --accent: #007bff;
    --accent-hover: #0056b3;
    --success: #28a745;
    --warning: #ffc107;
    --danger: #dc3545;
  }

  html[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #404040;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-muted: #808080;
    --border-color: #404040;
    --shadow: rgba(0, 0, 0, 0.3);
    --accent: #4dabf7;
    --accent-hover: #339af0;
    --success: #51cf66;
    --warning: #ffd43b;
    --danger: #ff6b6b;
  }

  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: var(--accent);
          color: white;
          &:hover {
            background-color: var(--accent-hover);
          }
        `;
      case 'secondary':
        return `
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          &:hover {
            background-color: var(--bg-tertiary);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: var(--text-secondary);
          &:hover {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
          }
        `;
      default:
        return `
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          &:hover {
            background-color: var(--bg-tertiary);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const Card = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px var(--shadow);
  }
`;

export const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px var(--shadow);
`;