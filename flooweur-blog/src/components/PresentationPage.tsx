import React from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const PresentationContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const SearchButton = styled.button`
  background: var(--accent);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--shadow);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow);
  }
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 48px;
  line-height: 1.6;
`;

const Description = styled.div`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

interface PresentationPageProps {
  onSearchClick: () => void;
}

const PresentationPage: React.FC<PresentationPageProps> = ({ onSearchClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PresentationContainer>
      <Header>
        <div />
        <ThemeToggle onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </ThemeToggle>
      </Header>

      <MainContent>
        <Title>Presentation Page</Title>
        <Subtitle>Welcome to Flooweur's Blog</Subtitle>
        <Description>
          This is your personal space for thoughts, ideas, and stories. 
          Click the search button above to explore articles, create new content, 
          and organize your knowledge.
        </Description>
      </MainContent>

      <SearchButton onClick={onSearchClick}>
        <FiSearch />
      </SearchButton>
    </PresentationContainer>
  );
};

export default PresentationPage;