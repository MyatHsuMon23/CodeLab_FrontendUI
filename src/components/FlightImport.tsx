// src/components/FlightImport.tsx

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  GetApp as DownloadIcon,
  Visibility as PreviewIcon
} from '@mui/icons-material';
import { useImportFlights, useImportFlightsCSV } from '@hook/flight/mutations';
import { useAlert } from '@provider/AlertProvider';
import type { Flight } from '@type/flight.types';

// Sample flight data for demonstration
const SAMPLE_FLIGHTS: Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    flightNumber: 'AA1001',
    scheduledArrivalTimeUtc: '2024-12-29T14:30:00Z',
    originAirport: 'JFK',
    destinationAirport: 'LAX'
  },
  {
    flightNumber: 'DL2002',
    scheduledArrivalTimeUtc: '2024-12-29T16:45:00Z',
    originAirport: 'ATL',
    destinationAirport: 'ORD'
  },
  {
    flightNumber: 'UA3003',
    scheduledArrivalTimeUtc: '2024-12-29T18:20:00Z',
    originAirport: 'SFO',
    destinationAirport: 'DEN'
  },
  {
    flightNumber: 'WN4004',
    scheduledArrivalTimeUtc: '2024-12-29T20:15:00Z',
    originAirport: 'LAS',
    destinationAirport: 'PHX'
  },
  {
    flightNumber: 'B65005',
    scheduledArrivalTimeUtc: '2024-12-29T22:30:00Z',
    originAirport: 'BOS',
    destinationAirport: 'MCO'
  }
];

interface FlightImportProps {
  onImportComplete?: () => void;
}

const FlightImport: React.FC<FlightImportProps> = ({ onImportComplete }) => {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { showAlert } = useAlert();
  const importFlightsMutation = useImportFlights();
  const importFlightsCSVMutation = useImportFlightsCSV();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (!validTypes.includes(file.type) && !['csv', 'json'].includes(fileExtension || '')) {
      showAlert({
        type: 'error',
        message: 'Please select a CSV or JSON file'
      });
      return;
    }

    try {
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);


      if (fileExtension === 'json' || file.type === 'application/json') {
        // Read and parse JSON file
        const text = await file.text();
        let jsonPayload;
        try {
          jsonPayload = JSON.parse(text);
        } catch (err) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          showAlert({
            type: 'error',
            message: 'Invalid JSON file format.'
          });
          return;
        }
        await importFlightsMutation.mutateAsync(jsonPayload);
      } else {
        // CSV file
        await importFlightsCSVMutation.mutateAsync(file);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      showAlert({
        type: 'success',
        message: `Successfully imported flights from ${file.name}`
      });

      onImportComplete?.();

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (error: any) {
      setUploadProgress(0);
      showAlert({
        type: 'error',
        message: error.message || 'Failed to import flights'
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateSampleCSV = () => {
    const headers = ['flightNumber', 'scheduledArrivalTimeUtc', 'originAirport', 'destinationAirport'];
    const csvContent = [
      headers.join(','),
      ...SAMPLE_FLIGHTS.map(flight => [
        flight.flightNumber,
        flight.scheduledArrivalTimeUtc,
        flight.originAirport,
        flight.destinationAirport
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_flights.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateSampleJSON = () => {
    const jsonContent = JSON.stringify(SAMPLE_FLIGHTS, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_flights.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const loadSampleData = async () => {
    try {
      // Simulate loading sample data
      const sampleData = {
        success: true,
        data: SAMPLE_FLIGHTS.map((flight, index) => ({
          ...flight,
          id: `sample-${index + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      };

      // This would normally be handled by the mutation, but for demo purposes:
      showAlert({
        type: 'success',
        message: 'Sample flight data loaded successfully!'
      });
      
      onImportComplete?.();
    } catch (error: any) {
      showAlert({
        type: 'error',
        message: 'Failed to load sample data'
      });
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Import Flight Data
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Import flights from CSV or JSON files. The file should contain flight information with 
            Flight Number, Scheduled Arrival Time (UTC), Origin Airport, and Destination Airport.
          </Typography>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Importing flights... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <Box display="flex" gap={2} flexWrap="wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.json,text/csv,application/json"
              style={{ display: 'none' }}
            />
            
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleFileSelect}
              disabled={importFlightsCSVMutation.isPending || (uploadProgress > 0 && uploadProgress < 100)}
            >
              Upload File
            </Button>

            {/* <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewDialogOpen(true)}
            >
              Preview Sample Data
            </Button> */}

            {/* <Button
              variant="outlined"
              onClick={loadSampleData}
              disabled={importFlightsMutation.isPending}
            >
              Load Sample Data
            </Button> */}
          </Box>

          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Download sample files:
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={generateSampleCSV}
              >
                Sample CSV
              </Button>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={generateSampleJSON}
              >
                Sample JSON
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Expected format:</strong><br />
              • Flight Number (e.g., "AA1001")<br />
              • Scheduled Arrival Time UTC (ISO 8601 format, e.g., "2024-12-29T14:30:00Z")<br />
              • Origin Airport (3-letter code, e.g., "JFK")<br />
              • Destination Airport (3-letter code, e.g., "LAX")
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sample Flight Data Preview</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Flight Number</TableCell>
                  <TableCell>Scheduled Arrival (UTC)</TableCell>
                  <TableCell>Origin</TableCell>
                  <TableCell>Destination</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SAMPLE_FLIGHTS.map((flight, index) => (
                  <TableRow key={index}>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{flight.scheduledArrivalTimeUtc}</TableCell>
                    <TableCell>{flight.originAirport}</TableCell>
                    <TableCell>{flight.destinationAirport}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewDialogOpen(false);
              loadSampleData();
            }}
          >
            Load This Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightImport;