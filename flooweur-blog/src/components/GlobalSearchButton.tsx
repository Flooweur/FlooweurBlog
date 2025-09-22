import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SearchButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const Mouth = styled.div<{ x: number; y: number }>`
  position: absolute;
  bottom: 16px;
  left: 50%;
  width: 16px;
  height: 8px;
  background-color: white;
  border-left: 2px solid white;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  border-top: none;
  border-radius: 0 0 16px 16px;
  opacity: 0;
  transition: all 0.1s ease;
  transform: translate(${props => props.x - 8}px, ${props => props.y}px);
`;

const Eye = styled.div<{ x: number; y: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.1s ease;
  transform: translate(${props => props.x}px, ${props => props.y}px);
`;

const LeftEye = styled(Eye)`
  left: 18px;
  top: 22px;
`;

const RightEye = styled(Eye)`
  right: 18px;
  top: 22px;
`;

const SearchButton = styled.button`
  background: var(--accent);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--shadow);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow);

    ${Mouth} {
      opacity: 1;
    }

    ${Eye} {
      width: 10px;
      height: 10px;
    }

    ${LeftEye} {
      left: 17px;
      top: 21px;
    }

    ${RightEye} {
      right: 17px;
      top: 21px;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

interface GlobalSearchButtonProps {
  onClick: () => void;
}

const GlobalSearchButton: React.FC<GlobalSearchButtonProps> = ({ onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Eye tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const button = document.querySelector('[data-search-button]') as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Limit eye movement to stay within the button
        const maxDistance = 6;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const limitedDistance = Math.min(distance, maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const limitedX = Math.cos(angle) * limitedDistance;
        const limitedY = Math.sin(angle) * limitedDistance;

        setMousePosition({ x: limitedX, y: limitedY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <SearchButtonContainer>
      <SearchButton
        onClick={onClick}
        data-search-button
      >
        <LeftEye x={mousePosition.x} y={mousePosition.y} />
        <RightEye x={mousePosition.x} y={mousePosition.y} />
        <Mouth x={mousePosition.x} y={mousePosition.y}/>
      </SearchButton>
    </SearchButtonContainer>
  );
};

export default GlobalSearchButton;