import styled from 'styled-components';
import { checkeredBlack, checkeredWhite } from '../../../styles/colors';

export const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  color: white;

  tr:nth-child(even) {
    td:nth-child(2n + 3) {
      background: ${checkeredBlack};
    }
  }

  tr:nth-child(odd) {
    td:nth-child(2n + 2) {
      background: ${checkeredBlack};
    }
  }

  .--check {
    background: #ff0038;
  }
`;

export const TableHeader = styled.th`
  padding: .5em;
`;

export const TableCell = styled.td`
  width: 90px;
  height: 90px;
  position: relative;
  background: ${checkeredWhite};
`;
