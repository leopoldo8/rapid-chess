import styled from 'styled-components';

export const PieceElement = styled.div`
  width: 90%;
  padding: 5%;
  cursor: grab;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  user-select: none;
`;

export const PieceIMG = styled.img`
  max-width: 100%;
  width: 100%;
  pointer-events: none;
`;
