import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8e2de2" },
    secondary: { main: "#ff9800" },
    background: {
      default: "#0a0c1d",
      paper: "rgba(20, 20, 40, 0.85)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cfd8dc",
    },
  },
  typography: {
    fontFamily: "'Orbitron', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: "2.5rem",
      textShadow: "0 0 25px rgba(142,45,226,0.8)",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: 1.5,
      fontSize: "2rem",
      textShadow: "0 0 18px rgba(255,152,0,0.7)",
    },
    body1: {
      fontSize: "1rem",
      color: "#e0e0e0",
      lineHeight: 1.6,
    },
    button: {
      fontSize: "1rem",
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 0 30px rgba(142,45,226,0.5)",
          padding: "20px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 0 35px rgba(142,45,226,0.75)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "12px 24px",
          background: "linear-gradient(45deg, #8e2de2, #4a00e0)",
          color: "#fff",
          transition: "0.3s",
          "&:hover": {
            background: "linear-gradient(45deg, #4a00e0, #8e2de2)",
            boxShadow: "0 0 20px rgba(142,45,226,0.9)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          "& .MuiInputBase-input": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "&:hover fieldset": {
              borderColor: "#8e2de2",
              boxShadow: "0 0 10px rgba(142,45,226,0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff9800",
              boxShadow: "0 0 12px rgba(255,152,0,0.8)",
            },
          },
        },
      },
    },
  },
});

export default theme;