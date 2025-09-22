import React from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

// Icon wrapper to fix TypeScript compatibility with React 19
const Icon = ({ IconComponent, ...props }: { IconComponent: any; [key: string]: any }) => {
  return React.createElement(IconComponent, props);
};

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
  padding-bottom: 80px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 50%;
    height: 1px;
    background: var(--border-color);
    margin-right: 40px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 60px;
    left: 50%;
    right: 0;
    height: 1px;
    background: var(--border-color);
    margin-left: 40px;
  }
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

const PresentationPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PresentationContainer>
      <Header>
        <div />
        <ThemeToggle onClick={toggleTheme}>
          {theme === 'light' ? <Icon IconComponent={FiMoon} size={16} /> : <Icon IconComponent={FiSun} size={16} />}
        </ThemeToggle>
      </Header>

      <MainContent>
        <Title>Flooweur's Blog</Title>
        <Subtitle>Welcome to my small internet land plot, that I will use to immortalize my thoughts, ideas and stories</Subtitle>
        <Description>
          <p>
            According to the Extended Intelligence Theory,
            our intelligence isn't only limited to the capacity of our brain,
            but also to the context we are in. For example, when solving complex
            mathematical problems, it can become especially hard to keep track of the
            numbers without a surface to write them down, so naturally, we will grab a notebook,
            or start writing equations on a whiteboard, this support then becomes part
            of our extended intelligence, a support that is an integral part of our thought process.
          </p>
          <br />
          <p>
            This Blog will be my own, public, virtual Extended Intelligence notebook,
            I will use it to write down my thoughts, ideas, stories, progress and just anything else
            that comes to my mind. I must apologize in advance, for my mind is quite messy and so will
            probably be the content of my blog, I will try to keep it organized using the tags but no promises there.
            I hope that you will find some interest in this window into what is inside of my cranium.
          </p>
        </Description>
      </MainContent>
    </PresentationContainer>
  );
};

export default PresentationPage;