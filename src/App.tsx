import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Box, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import ListIcon from "@mui/icons-material/List";
import PreviousRenders from "./components/PreviousRenders";
import PrototypeView from "./components/PrototypeView";

const App: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: "#0d47a1" }}>
        <Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flexGrow: 1 }}
          >
            <Tab
              label="Create Rendering"
              component={Link}
              to="/"
              icon={<UploadIcon />}
              iconPosition="start"
              sx={{ fontWeight: 500 }}
            />
            <Tab
              label="Previous Renders"
              component={Link}
              to="/renders"
              icon={<ListIcon />}
              iconPosition="start"
              sx={{ fontWeight: 500 }}
            />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        <Routes>
          <Route path="/" element={<PrototypeView />} />
          <Route path="/renders" element={<PreviousRenders />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
