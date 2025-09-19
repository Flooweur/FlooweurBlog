import React from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

const SearchButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
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

  &:active {
    transform: translateY(0);
  }
`;

interface GlobalSearchButtonProps {
  onClick: () => void;
}

const GlobalSearchButton: React.FC<GlobalSearchButtonProps> = ({ onClick }) => {
  return (
    <SearchButtonContainer>
      <SearchButton onClick={onClick}>
        <FiSearch />
      </SearchButton>
    </SearchButtonContainer>
  );
};

export default GlobalSearchButton;