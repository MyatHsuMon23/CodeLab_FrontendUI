import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Divider,
  Checkbox,
  ListItemText
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import uploadImg from '@assets/images/upload.png';
// import IX from '@assets/images/IX_white.png';
import IX from '@assets/images/IX.png';
import { Delete, Article } from '@mui/icons-material';
import customTheme from "../theme.js";
import { useAlert } from '@provider/AlertProvider.js';
import { useAnalyzeFTACheck, useCreateFTACheck, useFileUpload } from '@hook/fta-check-analysis/mutations.js';

const originCountries = [
  { name: "United States", code: "US", flag: "https://flagcdn.com/us.svg" },
  { name: "Canada", code: "CA", flag: "https://flagcdn.com/ca.svg" },
  { name: "Germany", code: "DE", flag: "https://flagcdn.com/de.svg" },
  { name: "France", code: "FR", flag: "https://flagcdn.com/fr.svg" },
  { name: "Japan", code: "JP", flag: "https://flagcdn.com/jp.svg" },
  { name: "India", code: "IN", flag: "https://flagcdn.com/in.svg" },
  { name: "Brazil", code: "BR", flag: "https://flagcdn.com/br.svg" },
  { name: "Australia", code: "AU", flag: "https://flagcdn.com/au.svg" },
  { name: "China", code: "CN", flag: "https://flagcdn.com/cn.svg" },
  { name: "South Africa", code: "ZA", flag: "https://flagcdn.com/za.svg" }
];

const Create = () => {
  const [selectedCountries, setSelectedCountries] = useState<typeof originCountries>([]);
  const [referenceNo, setReferenceNo] = useState('');
  const [processingFiles, setProcessingFiles] = useState<{ name: string; size: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const createFTACheckMutation = useCreateFTACheck();
  const fileUploadMutation = useFileUpload();
  const analyzeFTACheckMutation = useAnalyzeFTACheck();

  // Loading states for each mutation
  const isCreating = createFTACheckMutation.isPending;
  const isUploading = fileUploadMutation.isPending;
  const isAnalyzing = analyzeFTACheckMutation.isPending;

  const handleBrowseFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ];

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      showAlert({
        type: 'error',
        message: 'Only PDF, Excel, CSV, Word, or image files are allowed.'
      });
      return;
    }
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      progress: 0 // Start at 0, update as needed
    }));
    setProcessingFiles(prev => [...prev, ...newFiles]);
    // Simulate progress (for demo)
    newFiles.forEach((file) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setProcessingFiles(prev =>
          prev.map(f =>
            f.name === file.name
              ? { ...f, progress: Math.min(prog, 100) }
              : f
          )
        );
        if (prog >= 100) clearInterval(interval);
      }, 200);
    });
  }, [showAlert]);

  const handleRemoveFile = useCallback((fileName: string) => {
    setProcessingFiles(prev => prev.filter(f => f.name !== fileName));
  }, []);

  const handleCheckAIButtonClick = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Create FTA Check
      const createPayload = {
        pack_name: "Testing Pack Name",
        pack_description: "Testing Pack Description",
        countries: selectedCountries.map(c => c.code)
      };
      const createRes = await createFTACheckMutation.mutateAsync(createPayload);
      if (!createRes?.data?.id) throw new Error("FTA Check creation failed");
      const packId = createRes.data.id;

      // 2. Upload files
      const filesArray = fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : [];
      const uploadPayload = {
        id: packId,
        files: filesArray,
        file_types: [],
        extract_immediately: true, 
        processing_options: []
      };
      const uploadRes = await fileUploadMutation.mutateAsync(uploadPayload);
      if (!uploadRes.data.pack.id) throw new Error("File upload failed");

      // 3. Analyze FTA Check
      const analyzeRes = await analyzeFTACheckMutation.mutateAsync({ packId });
      if (!analyzeRes.success) {
        throw new Error(analyzeRes?.message || "FTA Analyze failed");
      }
      showAlert({ type: 'success', message: 'FTA Check completed successfully!' });
      navigate('/fta-check-detail');
    } catch (err: any) {
      showAlert({ type: 'error', message: err.message || 'Process failed.' });
    } finally {
      setLoading(false);
    }
  }, [createFTACheckMutation, fileUploadMutation, analyzeFTACheckMutation, showAlert, navigate]);

  return (
    <Paper sx={{ p: 3, borderRadius: '6px', boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: '20px' }}>
        FTA Check
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography sx={{ mb: 2, fontSize: '14px' }}>
        Please update the FTA references and origins you wish to check below.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '80%' }}>
        <Autocomplete
          multiple
          options={originCountries}
          getOptionLabel={(option) => option.name}
          value={selectedCountries}
          onChange={(_, value) => setSelectedCountries(value)}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => {
            // Extract key from props and pass it directly
            const { key, ...restProps } = props;
            return (
              <li
                key={key}
                {...restProps}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 2,
                  paddingBottom: 2,
                  minHeight: 32,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={selected} sx={{ mr: 1, p: 0.5 }} />
                  <ListItemText primary={option.name} />
                </Box>
                <img
                  src={option.flag}
                  alt={option.name}
                  style={{
                    width: 28,
                    height: 20,
                    objectFit: 'cover',
                    marginLeft: 12,
                    borderRadius: 2,
                    border: '1px solid #eee'
                  }}
                />
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Origin Countries" variant="filled" fullWidth />
          )}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Reference No."
          variant="filled"
          value={referenceNo}
          onChange={e => setReferenceNo(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>
      <Typography sx={{ mt: 1, mb: 2, fontSize: '14px' }} color={customTheme.palette.text.primary}>
        Upload BOMS, Packing Lists, Invoices, or any relating documents that could help support the FTA check.
      </Typography>

      <Box
        sx={{
          border: `2px dashed ${customTheme.palette.primary.main}`,
          background: '#fff7ef',
          borderRadius: 2,
          p: 3,
          mb: 2,
          textAlign: 'center',
          color: customTheme.palette.primary.main,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={uploadImg}
          alt="Upload"
          style={{ width: 35, height: 40, marginBottom: 15 }}
        />
        <Typography variant='body2' sx={{ mb: 2 }} color={customTheme.palette.text.primary}>
          Drag and Drop Files here or
        </Typography>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFilesChange}
        />
        <Button
          variant="outlined"
          sx={{
            fontWeight: 600,
            px: 2,
          }}
          onClick={handleBrowseFiles}
        >
          Browse Files
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <WarningAmberRoundedIcon sx={{ color: '#fbc02d', mr: 1, mt: '2px' }} />
        <Typography variant="body2" sx={{ color: '#737F9E', fontSize: '14px', fontStyle: 'italic' }}>
          To decrease costs and AI compute, please use pragmatically created documents as opposed to scanned / image documents. If images are used then OCR will be used and additional costs could be incurred.
        </Typography>
      </Box>
      {processingFiles.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {processingFiles.map((file) => (
            <Box
              key={file.name}
              sx={{
                width: 230,
                p: 1.5,
                border: '1px solid #eee',
                borderRadius: '5px',
                background: '#fff',
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    background: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1
                  }}
                >
                  <Article />
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: 14, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </Typography>
                <Delete color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleRemoveFile(file.name)} />
              </Box>
              <Typography sx={{ fontSize: 12, color: '#989692', mb: 0.5, marginLeft: '30px', lineHeight: 1 }}>{file.size}</Typography>
              <Box sx={{ width: '100%', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    background: '#f0f0f0',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      width: `${file.progress}%`,
                      height: '100%',
                      background: customTheme.palette.success.main,
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#737F9E', alignSelf: 'flex-end' }}>
                    {file.progress}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      <Button
        variant="contained"
        disabled={
          loading || isCreating || isUploading || isAnalyzing ||
          processingFiles.length === 0 ||
          selectedCountries.length === 0 ||
          referenceNo.trim() === "" ||
          processingFiles.some(f => f.progress < 100)
        }
        onClick={handleCheckAIButtonClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {(loading || isCreating || isUploading || isAnalyzing)
          ? 'Processing...'
          : (<><img src={IX} alt="ix" style={{ height: 12, marginRight: 2 }} />AI Check</>)}
      </Button>
    </Paper>
  );
};

export default Create;
