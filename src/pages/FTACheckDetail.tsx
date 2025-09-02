import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  InputBase,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import Replay from '@mui/icons-material/Replay';
import Add from '@mui/icons-material/Add';
import Work from '@mui/icons-material/Work';
import AttachFile from '@mui/icons-material/AttachFile';
import KeyboardVoice from '@mui/icons-material/KeyboardVoice';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import IX from '@assets/images/IX.png';
import customTheme from '../theme.js';

const aiSummaryTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Andorra', value: 'andorra' },
  { label: 'United Arab Emirates', value: 'uae' },
  { label: 'China', value: 'china' }
];

const aiSummaryContent = {
  overview: (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 14, mb: 1 }}>
        Overview Tab
      </Typography>
    </Box>
  ),
  andorra: (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 14 }}>
        Andorra-specific summary content goes here.
      </Typography>
    </Box>
  ),
  uae: (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 14 }}>
        United Arab Emirates-specific summary content goes here.
      </Typography>
    </Box>
  ),
  china: (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 14 }}>
        China-specific summary content goes here.
      </Typography>
    </Box>
  )
};

// Add sample table data for demo
const sampleTableData = Array.from({ length: 27 }).map((_, i) => ({
  ref: `S00000${i + 1}`,
  country: ["Andorra", "UAE", "China", "Japan", "India", "France", "Germany", "Brazil", "Australia"][i % 9],
  aiStatus: "Analysed",
  ftaRule: i % 3 === 0 ? "WOP" : "RVC / PCR",
  userApproval: i % 2 === 0 ? "Approved" : "Rejected",
  review: "pending"
}));

const rowsPerPageOptions = [5, 10, 30];

const FTACheckDetail = () => {
  // Add missing state
  const [tableData, setTableData] = useState(sampleTableData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean, rowIdx: number | null }>({ open: false, rowIdx: null });
  const [rejectMsg, setRejectMsg] = useState('');
  const [chatMessages, setChatMessages] = useState<{ rowIdx: number; text: string }[]>([]);
  const [aiSummaryTab, setAiSummaryTab] = useState("overview");

  // Pagination logic
  const pagedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalRows = tableData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Approve/reject logic
  const handleApprove = (idx: number) => {
    setTableData(prev =>
      prev.map((row, i) =>
        i === idx ? { ...row, review: "approved" } : row
      )
    );
  };

  const handleReject = (idx: number) => {
    setTableData(prev =>
      prev.map((row, i) =>
        i === idx ? { ...row, review: "rejected" } : row
      )
    );
    setRejectDialog({ open: true, rowIdx: idx });
    setRejectMsg('');
  };

  const handleRejectConfirm = () => {
    if (rejectDialog.rowIdx !== null && rejectMsg.trim()) {
      setChatMessages(prev => [
        ...prev,
        { rowIdx: rejectDialog.rowIdx!, text: rejectMsg }
      ]);
    }
    // Optionally close dialog after sending
    // setRejectDialog({ open: false, rowIdx: null });
    // setRejectMsg('');
  };

  const handleRejectCancel = () => {
    setRejectDialog({ open: false, rowIdx: null });
    setRejectMsg('');
  };

  return (
    <Box>
      {/* FTA Check Table */}
      <Paper sx={{ p: 3, borderRadius: '6px', boxShadow: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: '20px' }}>
          FTA Check
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f7f7f7', color: '#364261', fontWeight: 600 }}>
                <th style={{ padding: 8, textAlign: 'center' }}>Ref. Code</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Country</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Ai Status</th>
                <th style={{ padding: 8, textAlign: 'center' }}>FTA Rule</th>
                <th style={{ padding: 8, textAlign: 'center' }}>User Approval</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row, idx) => (
                <tr
                  key={row.ref + row.country}
                  style={{
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <td style={{ padding: 8, textAlign: 'center' }}>{row.ref}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{row.country}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{row.aiStatus}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{row.ftaRule}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{row.userApproval}</td>
                  <td style={{ padding: 8, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Approve Button */}
                    {row.review !== 'approved' ? (
                      <IconButton
                        aria-label="approve"
                        size="small"
                        onClick={() => {
                          const realIdx = page * rowsPerPage + idx;
                          handleApprove(realIdx);
                        }}
                        sx={{ color: '#22c55e' }}
                      >
                        <CheckIcon />
                      </IconButton>
                    ) : (
                      <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 24 }} />
                    )}
                    {/* Reject Button */}
                    {row.review !== 'rejected' ? (
                      <IconButton
                        aria-label="reject"
                        size="small"
                        onClick={() => {
                          const realIdx = page * rowsPerPage + idx;
                          handleReject(realIdx);
                        }}
                        sx={{
                          color: '#bdbdbd',
                          ml: 1
                        }}
                        disabled={row.review === 'approved'}
                      >
                        <BlockIcon />
                      </IconButton>
                    ) : (
                      <BlockIcon sx={{ color: '#e53935', fontSize: 24, ml: 1 }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1, fontSize: 13, color: '#737F9E' }}>
            <Typography sx={{ mr: 1, fontSize: 14 }}>Rows per page:</Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              sx={{ width: 70, mr: 2, fontSize: 12 }}
              variant="standard"
            >
              {rowsPerPageOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            <span style={{ margin: '0 8px', fontSize: 14 }}>
              {totalRows === 0
                ? '0-0'
                : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalRows)}`}
              {' '}of {totalRows}
            </span>
            <IconButton
              size="small"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              sx={{ fontSize: 18, mr: 1 }}
            >
              {'<'}
            </IconButton>
            <IconButton
              size="small"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              sx={{ fontSize: 18 }}
            >
              {'>'}
            </IconButton>
          </Box>
        </Box>
      </Paper>
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            border: '2px solid #B91B4D',
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: 20,
            pb: 1,
            pt: 2,
            pl: 3,
            pr: 3,
            borderBottom: '1px solid #f0f0f0',
            background: '#fff',
            position: 'relative'
          }}
        >
          <IconButton size="small">
            <Replay sx={{ fontSize: 22, color: '#000' }} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <span style={{ fontWeight: 700, color: '#15395B', fontSize: 18 }}>
              Reject Ref No. FTA China
            </span>
          </Box>
          <IconButton size="small">
            <Add sx={{ fontSize: 22, color: '#000' }} />
          </IconButton>
          <IconButton size="small" onClick={handleRejectCancel}>
            <CloseIcon sx={{ fontSize: 22, color: '#000' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2, px: 3, background: '#fff' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            mt: 2,
            background: '#F7F7F7',
            borderRadius: '6px',
            p: 1.2,
            pl: 2
          }}>
            <Work sx={{ color: customTheme.palette.primary.main, marginRight: '10px' }} />
            <Typography sx={{ fontWeight: 600, color: '#364261', fontSize: 15 }}>@FTA Check</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, padding: '0 15px' }}>
            <img src={IX} alt="ix" style={{ height: 25, marginRight: 10, marginTop: 10 }} />
            <Typography sx={{ color: '#364261', fontSize: 15, mt: 0.5 }}>
              Hey there we noticed you rejected this item, can you explain why to teach me how to rectify this issue in the future?
            </Typography>
          </Box>
          {/* Chat message (right side) */}
          {rejectDialog.rowIdx !== null &&
            chatMessages
              .filter(msg => msg.rowIdx === rejectDialog.rowIdx)
              .map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    background: '#1e3a5c',
                    color: '#fff',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mb: 2,
                    ml: 'auto',
                    maxWidth: '90%',
                    fontSize: 15,
                    fontWeight: 500,
                    display: 'inline-block',
                    textAlign: 'right'
                  }}
                >
                  {msg.text}
                </Box>
              ))
          }
          {/* Show current input as a right-side message preview */}
          {rejectMsg.trim() && (
            <Box
              sx={{
                background: '#1e3a5c',
                color: '#fff',
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 2,
                ml: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
                width: 'max-content',
              }}
            >
              <div>{rejectMsg}</div>
            </Box>
          )}
          <Box sx={{
            background: '#f8fafc',
            borderRadius: 2,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            mb: 1
          }}>
            <InputBase
              placeholder="Message iX Ai...."
              value={rejectMsg}
              onChange={e => setRejectMsg(e.target.value)}
              sx={{
                flex: 1,
                fontSize: 15,
                background: 'transparent',
                border: 'none',
                px: 0,
                py: 0.5
              }}
              multiline
              minRows={1}
              endAdornment={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                  <IconButton sx={{ color: '#000', padding: '3px' }}>
                    <AttachFile sx={{ fontSize: 25 }} />
                  </IconButton>
                  <IconButton sx={{ color: '#000', padding: '3px' }}>
                    <KeyboardVoice sx={{ fontSize: 25 }} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    disabled={!rejectMsg.trim()}
                    onClick={handleRejectConfirm}
                    sx={{
                      background: customTheme.palette.primary.main,
                      color: '#fff',
                      padding: '5px',
                      '&:disabled': { background: '#f5d6b3', color: '#fff' },
                      '&:hover': { background: customTheme.palette.primary.dark }
                    }}
                  >
                    <ArrowUpward sx={{ fontSize: 20, fontWeight: 600 }} />
                  </IconButton>
                </Box>
              }
            />
          </Box>
        </DialogContent>
      </Dialog>
      {/* Ai Summary Card */}
      <Paper sx={{ p: 3, borderRadius: '6px', boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={IX} alt="ix" style={{ height: 18, marginRight: 8 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px' }}>Ai Summary</Typography>
          </Box>
          <Typography sx={{ fontWeight: 500, fontSize: 16, color: '#364261' }}>Jan 01, 2025</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {/* Tabs for Ai Summary */}
        <Box sx={{ borderBottom: 1, borderColor: '#eee', mb: 2 }}>
          <Tabs
            value={aiSummaryTab}
            onChange={(_, newValue) => setAiSummaryTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: 36,
              '& .MuiTabs-list, & .MuiTabs-flexContainer': {
                gap: '5em'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                color: customTheme.palette.primary.main,
                fontWeight: 700,
                fontSize: 15,
                minHeight: 36,
                px: 2,
                '&.Mui-selected': {
                  opacity: 1,
                  borderBottom: `3px solid ${customTheme.palette.primary.main}`,
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            {aiSummaryTabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        {/* Tab Content */}
        <Box sx={{padding: '0 10px'}}>
          {aiSummaryContent[aiSummaryTab]}
        </Box>
      </Paper>
    </Box>
  );
};

export default FTACheckDetail;
