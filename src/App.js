import logo from "./logo.svg";
import "./App.css";
import { DashboardHome } from "./components/dashboard/home/DashboardHome";
import { useMemo, useState } from "react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { amber, deepOrange, grey } from "@mui/material/colors";
import { ThemeOptions } from "@mui/material/styles";

function App() {
  const [mode, setMode] = useState("light");

  return (
    <ThemeProvider theme={mode === "light" ? light : dark}>
      <DashboardHome setMode={setMode} mode={mode} />;
    </ThemeProvider>
  );
}

export default App;

export const dark = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Modify this color to change the background color
    },
  },
});
export const light = createTheme({
  palette: {
    mode: "light",
  },
});
