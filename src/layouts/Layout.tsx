import * as React from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from "@mui/material";
import coverImg from "@assets/images/cover.png";
import { RootState } from "@store/reduxStore";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (accessToken) {
      navigate('/flights');
    }
  }, [accessToken, navigate]);
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#F6F7F9",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 0,
          overflow: "hidden",
          width: "100%",
          minHeight: "100vh",
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxSizing: "border-box",
        }}
      >


        {/* Centered Login Box */}
        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: { xs: 2, md: 0 },
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
