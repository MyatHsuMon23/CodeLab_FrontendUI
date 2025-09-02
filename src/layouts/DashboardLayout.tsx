import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  Box,
  IconButton,
} from "@mui/material";
import { Notifications, Settings, ChevronLeft } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedMenu } from '@store/menuReducer.js'; // adjust the path as needed
import logoWhite from "@assets/images/logo_white.png";
import { sideMenuRoutes } from "../routes/sideMenuRoutes.js";
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery } from "@mui/material";
import customTheme from "../theme.js";
import { useState } from "react";
import ixLogo from "@assets/images/IX.png";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const drawerWidth = isXs ? 180 : isSm ? 200 : 220;
  const [minimized, setMinimized] = useState(false);

  const minimizedWidth = 80;

  const { selectedMenu, subTitle } = useSelector((state: any) => state.menu);
  
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
              <img src={logoWhite} alt="Yusen Logistics" style={{ width: '80%' }} />
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
                  <span>{menu.icon}</span>
                  {!minimized && <Typography>{menu.label}</Typography>}
                </Link>
              </Box>
            ))}
          </Box>
          <Box sx={{ position: "relative", minHeight: 60 }}>
            <Box
              sx={{
                position: "absolute",
                left: minimized ? "20px" : -20,
                bottom: 8,
                transform: minimized ? "translateX(-50%)" : "none",
                background: "#fff",
                borderRadius: "0px 20px 20px 0px",
                px: 1.5,
                py: 0.5,
                display: "inline-flex",
                alignItems: "center",
                boxShadow: 1,
              }}
            >
              <img src={ixLogo} alt="ix" style={{ height: 25 }} />
            </Box>
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
              <IconButton><Notifications color="primary" /></IconButton>
              <IconButton><Settings color="primary" /></IconButton>
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
