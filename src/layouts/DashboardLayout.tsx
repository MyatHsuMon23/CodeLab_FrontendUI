import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  Box,
  IconButton,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Notifications, Settings, ChevronLeft } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedMenu } from '@store/menuReducer.js'; // adjust the path as needed
import logoWhite from "@assets/images/logo_white.png";
import { sideMenuRoutes } from "../routes/sideMenuRoutes.js";
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery } from "@mui/material";
import customTheme from "../theme.js";
import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { logout } from '@store/authReducer.js';
import { RootState } from "@store/reduxStore.js";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const drawerWidth = isXs ? 180 : isSm ? 200 : 220;
  const [minimized, setMinimized] = useState(false);

  const minimizedWidth = 80;

  const { selectedMenu, subTitle } = useSelector((state: any) => state.menu);
  const { accessToken } = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: minimized ? minimizedWidth : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: minimized ? minimizedWidth : drawerWidth,
            boxSizing: "border-box",
            background: customTheme.palette.secondary.main,
            color: "white",
            transition: "width 0.2s",
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ padding: minimized ? '10px 8px' : '10px 20px', height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            {!minimized && (
              <img src={logoWhite} alt="Logo Image" style={{ width: '60%' }} />
            )}
          </Box>
          <Box sx={{ mt: 2, flexGrow: 1 }}>
            {sideMenuRoutes.map((menu) => (
              <Box key={menu.path} sx={{ mb: 2 }}>
                <Link
                  to={menu.path}
                  onClick={() => {
                    dispatch(setSelectedMenu({
                      selectedMenu: menu.label,
                      subTitle: menu.description || ''
                    }));
                  }}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: minimized ? '0px' : '20px',
                    justifyContent: minimized ? 'center' : 'flex-start',
                  }}
                >
                  <span style={{ color: theme.palette.primary.main }}>{menu.icon}</span>
                  {!minimized && <Typography sx={{ fontSize: minimized ? '0.5rem' : '14px !important' }}>{menu.label}</Typography>}
                </Link>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "end", mb: 1 }}>
            <IconButton
              onClick={() => setMinimized((prev) => !prev)}
              sx={{
                color: "white",
                transition: "transform 0.2s",
                ...(minimized && { transform: "rotate(180deg)" }),
              }}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Bar */}
        <AppBar
          position="static"
          elevation={0}
          color="default"
          sx={{ borderBottom: 1, borderColor: "#ccc", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: theme.zIndex.appBar }}
        >
          <Toolbar sx={{
            '@media (min-width:600px)': {
              minHeight: 70
            }
          }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {selectedMenu}
              <Typography variant="body2">{subTitle}</Typography>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton><Settings color="primary" /></IconButton>
              <IconButton onClick={() => { dispatch(logout()); navigate('/login'); }}>
                <Logout color="primary" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, background: "#f7f7f7" }}>
          <Box
            sx={{
              minHeight: "100vh",
              width: "100%",
              borderRadius: 2,
              boxSizing: "border-box",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
