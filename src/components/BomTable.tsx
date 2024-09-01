import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Component to display BOM using Material UI Table
const BomTable: React.FC<{ bom: Record<string, number> }> = ({ bom }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Part Id</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(bom).map(([name, quantity], index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BomTable;
