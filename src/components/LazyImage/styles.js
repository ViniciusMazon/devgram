import styled from 'styled-components';

export const Small = styled.ImageBackground`
  width: 100%;
  aspectRatio: ${props => props.ratio};
`;

export const Original = styled.Image`
  width: 100%;
  aspectRatio: ${props => props.ratio};
`;
