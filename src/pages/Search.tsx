import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button
} from '@mui/material';
import customTheme from "../theme.js"; 
import CustomTable from '../components/CustomTable.js';

const sampleData = [
    { ref: "S0000001", country: "Australia", status: "Approved", rule: "RVC", date: "Jan 01, 2024" },
    { ref: "S0000002", country: "Germany", status: "Approved", rule: "WOP", date: "Jan 01, 2024" },
    { ref: "S0000003", country: "Japan", status: "Approved", rule: "RVC", date: "Jan 01, 2024" },
    { ref: "S0000004", country: "Argentina", status: "Approved", rule: "RVC", date: "Jan 01, 2024" },
    { ref: "S0000005", country: "France", status: "Approved", rule: "WOP", date: "Jan 01, 2024" },
    { ref: "S0000006", country: "Italy", status: "Failed", rule: "WOP", date: "Jan 01, 2024" },
    { ref: "S0000007", country: "New Zealand", status: "Approved", rule: "RVC", date: "Jan 01, 2024" },
    { ref: "S0000008", country: "Croatia", status: "Approved", rule: "WOP", date: "Jan 01, 2024" },
    { ref: "S0000009", country: "England", status: "Failed", rule: "RVC", date: "Jan 01, 2024" }
];

const Search = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredData = sampleData.filter(row =>
        row.ref.toLowerCase().includes(search.toLowerCase()) ||
        row.country.toLowerCase().includes(search.toLowerCase()) ||
        row.status.toLowerCase().includes(search.toLowerCase()) ||
        row.rule.toLowerCase().includes(search.toLowerCase()) ||
        row.date.toLowerCase().includes(search.toLowerCase())
    );

    const pagedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const columns = [
        { label: "Ref. Code", field: "ref" },
        { label: "Country", field: "country" },
        { label: "Status", field: "status" },
        { label: "FTA Rule", field: "rule" },
        { label: "Date", field: "date" },
        {
            label: "Action",
            field: "action",
            render: () => (
                <Button variant="text" sx={{
                    color: customTheme.palette.primary.main,
                    minWidth: 0,
                    p: 0.5,
                    fontSize: '14px',
                    textTransform: 'none'
                }}>View</Button>
            )
        }
    ];

    return (
        <Paper sx={{ padding: '20px', borderRadius: '6px', boxShadow: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    FTA Check Search
                </Typography>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    sx={{ width: 200 }}
                    size="small"
                />
            </Box>
            <CustomTable
                columns={columns}
                data={pagedData}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={filteredData.length}
                onPageChange={setPage}
                onRowsPerPageChange={rows => {
                    setRowsPerPage(rows);
                    setPage(0);
                }}
                showPagination={true}
                sx={{ mb: 2 }}
            />
            {pagedData.length === 0 && (
                <Box sx={{ textAlign: 'center', color: '#aaa', fontSize: 16, mt: 2 }}>
                    No data found.
                </Box>
            )}
        </Paper>
    );
};

export default Search;