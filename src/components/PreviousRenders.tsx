import React, { useEffect, useState } from "react";
import { Box, Typography, List, Paper, Divider, Button } from "@mui/material";
import BomTable from "./BomTable";
import PrototypeView from "./PrototypeView";
import axiosApi from "../app/config";

const PreviousRenders: React.FC = () => {
  const [previousRenders, setPreviousRenders] = useState([]);
  const [previousRenderOpen, setPreviousRenderOpen] = useState(false);
  const [fileUrlDataVal, setFileUrlDataVal] = useState(false);

  useEffect(() => {
    const renderTable = async () => {
      const response = await axiosApi().get(`/api/getAll`);

      if (response?.status === 200) {
        setPreviousRenders(response?.data);
      } else {
        console.error("Something went wrong!!!");
      }
    };

    renderTable();
  }, []);

  const renderCanvas = (render: any) => {
    setFileUrlDataVal(render?.fileUrlData);
    setTimeout(() => {
      setPreviousRenderOpen(true);
    }, 0);
  };

  if (previousRenderOpen) {
    return (
      <PrototypeView isCanvasViewOpen={true} fileUrlDataVal={fileUrlDataVal} />
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Previous Renders
      </Typography>
      <List>
        {previousRenders.map((render: any) => (
          <Paper
            key={render._id}
            elevation={3}
            sx={{
              marginBottom: 3,
              padding: 2,
              borderRadius: 2,
              width: "70%",
              backgroundColor: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#333" }}
                    >
                      {render.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Rendered on:{" "}
                      {new Date(render.createdOn).toLocaleDateString()}
                    </Typography>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => renderCanvas(render)}
                  >
                    Render
                  </Button>
                </div>

                <Divider sx={{ marginY: 2 }} />
                <BomTable bom={render?.bom} />
              </Box>
            </Box>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default PreviousRenders;
