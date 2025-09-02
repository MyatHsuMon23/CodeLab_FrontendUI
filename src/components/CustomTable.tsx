import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TablePagination
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import customTheme from "../theme.js"; 

// Column definition: { label: string, field: string, align?: 'left'|'center'|'right', render?: (row) => React.ReactNode }
interface Column {
  label: string;
  field: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: any) => React.ReactNode;
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  showPagination?: boolean;
  sx?: any;
  loading?: boolean; // Add loading prop
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  page = 0,
  rowsPerPage = 10,
  totalRows = data.length,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 30],
  showPagination = false,
  sx,
  loading = false // Default loading to false
}) => {
  return (
    <TableContainer sx={{ position: 'relative', ...sx }}>
      {/* Loading overlay */}
      <Backdrop
        open={loading}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#333',
          backgroundColor: 'rgba(255,255,255,0.5)', // lighter backdrop
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Table
        sx={{
          '& .MuiTableCell-root': {
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '10px',
            paddingRight: '10px',
            fontSize: '14px'
          },
          '& .MuiTableRow-root': {
            height: '36px',
            transition: 'background 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)', // light gray hover
            }
          }
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.field} align={col.align || 'left'} sx={{ fontWeight: 600, fontSize: '15px !important' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={row.id || row.ref || idx}>
              {columns.map(col => (
                <TableCell key={col.field} sx={{fontWeight: 500}} align={col.align || 'left'}>
                  {col.render ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(_, newPage) => onPageChange && onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => onRowsPerPageChange && onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 30, 50]}
        />
      )}
    </TableContainer>
  );
};

export default CustomTable;
